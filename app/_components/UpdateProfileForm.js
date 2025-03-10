'use client';

import Image from "next/image";
import { useState } from "react";
import { updateProfile } from "@/app/_lib/actions";
import { useFormStatus } from "react-dom";
import ButtonSubmit from "./ButtonSubmit";

function UpdateProfileForm({ children, guest }) {
  const [count, setCount] = useState();
  const { fullName, email, nationality, nationalID, countryFlag } = guest;

  return (
    <form
      action={updateProfile}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name='fullName'
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {countryFlag ?
            <Image
              src={countryFlag}
              alt="Country flag"
              className="rounded-sm"
              width='40'
              height='20'
            /> : ''
          }
        </div>

        {children}

      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          defaultValue={nationalID}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <ButtonSubmit pendingLabel='Updating...'>Update profile</ButtonSubmit>
      </div>
    </form>
  );
}


export default UpdateProfileForm;
