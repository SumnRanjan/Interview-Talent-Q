import { Inngest } from "inngest"
import { connectDB } from "./db.js"
import User from "../models/user.js"
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } = event.data;
      
      const email = email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address;

      if (!email) {
        throw new Error("Primary email not found in Clerk event");
      }

      const newUser = {
        clerkId: id,
        email,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profileImage: image_url,
      };

      await User.create(newUser);
      console.log(`User created : ${email}`);

      //stream
      await upsertStreamUser({
        id : newUser.clerkId.toString(),
        name : newUser.name,
        image : newUser.profileImage
      })

      console.log(`User created in Stream : ${email}` )

    } catch (err) {
      console.error("sync-user failed : ", err);
      throw err; 
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();

      const { id } = event.data;
      console.log("Deleting user:", id);

      await User.deleteOne({ clerkId: id });
      console.log("User deleted from DB");

      await deleteStreamUser(id.toString())
      console.log("User deleted form stream")

    } catch (err) {
      console.error(" Error deleting user:", err);
      throw err;
    }
  }
);

export const functions = [ syncUser , deleteUserFromDB ] 