import { Suspense, useActionState, useOptimistic, useState } from "react";
import "./AsyncFormTest.css";

export const AsyncFormTest = () => {
  const [currentName, setCurrentName] = useState("");
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const mockChangeName = (name: string): Promise<string | null> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const passing = Math.random() >= 0.5;

        if (passing) resolve(null);

        resolve(`Error changing username to "${name}", please try again`);
      }, Math.random() * 1000);
    });

  const [error, submitAction, isPending] = useActionState(
    async (_: string | null, formData: FormData) => {
      if (isPending) return null;

      const newName = formData.get("username") as string;
      setOptimisticName(newName);
      const error = await mockChangeName(newName);
      if (error) {
        return error;
      }

      setCurrentName(newName);
      return null;
    },
    null
  );

  return (
    <>
      <form className="form" action={submitAction}>
        <p>Your name is: {optimisticName}</p>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" />

        <button type="submit" aria-disabled={isPending || undefined}>
          Update
        </button>

        {error && <span>{error}</span>}
      </form>
    </>
  );
};
