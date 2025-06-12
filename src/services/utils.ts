import { TronAccount } from "../types";

export function parseTronAccount(data: any): TronAccount {
    return {
      ...data,
      lastClaim: data.lastClaim ? new Date(data.lastClaim + "Z") : undefined,
      nextClaim: data.nextClaim ? new Date(data.nextClaim + "Z") : undefined,
      addedAt: data.addedAt ? new Date(data.addedAt + "Z") : undefined,
      userId: data.userId || undefined
    };
  }

  export function getRoleUser(jwtToken: string): string {
    if (!jwtToken) {
      return "user";
    }
    const role = JSON.parse(atob(jwtToken.split(".")[1])).role || "user";
    return role;
  }
