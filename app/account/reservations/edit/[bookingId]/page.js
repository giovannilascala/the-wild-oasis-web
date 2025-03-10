import ButtonSubmit from "@/app/_components/ButtonSubmit";
import { updateBookingAction } from "@/app/_lib/actions";
import { getBooking, getCabinCapacity } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { bookingId } = params;

  const { cabinId, observations, numGuests } = await getBooking(bookingId);
  const { maxCapacity } = await getCabinCapacity(cabinId);


  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form action={updateBookingAction} className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col">
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultValue={numGuests}
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder={observations}
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <ButtonSubmit pendingLabel={'Updating...'}>
            Update reservation
          </ButtonSubmit>
        </div>


        <input name="bookingId" hidden value={bookingId} />
      </form>
    </div>
  );
}


