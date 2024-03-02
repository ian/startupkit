import { getUser } from "../../auth";

export default async function AccountPage() {
  const { user } = await getUser();

  const userFields = user && [
    ["First name", user.firstName],
    ["Last name", user.lastName],
    ["Email", user.email],
    ["Id", user.id],
  ];

  return (
    <>
      {userFields && (
        <div className="flex flex-col space-y-2">
          {userFields.map(([label, value]) => (
            <div className="flex" key={value}>
              <label>
                <p>{label}</p>

                <input
                  className="border rounded p-2"
                  value={value || ""}
                  readOnly
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
