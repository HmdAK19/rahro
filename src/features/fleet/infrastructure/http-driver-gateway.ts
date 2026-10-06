import type { Driver, DriverChanges, DriverDraft } from "../domain/driver";

export class DriverRequestError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({ error: "UNKNOWN_ERROR" }))) as {
      error?: string;
    };

    throw new DriverRequestError(body.error ?? "UNKNOWN_ERROR");
  }

  return response.json() as Promise<T>;
}

export class HttpDriverGateway {
  create(input: DriverDraft) {
    return fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((response) => parse<Driver>(response));
  }
  update(id: string, changes: DriverChanges) {
    return fetch(`/api/drivers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    }).then((response) => parse<Driver>(response));
  }
  async delete(id: string) {
    const response = await fetch(`/api/drivers/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({ error: "UNKNOWN_ERROR" }))) as {
        error?: string;
      };

      throw new DriverRequestError(body.error ?? "UNKNOWN_ERROR");
    }
  }
}
