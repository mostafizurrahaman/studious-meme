"use server";

import type { FieldValues } from "react-hook-form";
import { updateTag } from "next/cache";

import { requestBackendJson } from "@/lib/backend-api";
import { getValidAccessTokenForServerActions } from "@/lib/getValidAccessToken";
import type { BackendPage } from "@/lib/page-content";

type BackendEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export const getAllPages = async (): Promise<
  BackendEnvelope<BackendPage[]>
> => {
  return requestBackendJson<BackendEnvelope<BackendPage[]>>("/page/retrieve", {
    method: "GET",
    next: { tags: ["PAGES"] },
  });
};

export const getPageByType = async (
  type: string,
): Promise<BackendEnvelope<BackendPage | null>> => {
  return requestBackendJson<BackendEnvelope<BackendPage | null>>(
    `/page/retrieve/${type}`,
    {
      method: "GET",
      next: { tags: ["PAGES"] },
    },
  );
};

export const createOrUpdatePageByType = async (
  data: FieldValues,
): Promise<BackendEnvelope<BackendPage>> => {
  const accessToken = await getValidAccessTokenForServerActions();
  const result = await requestBackendJson<BackendEnvelope<BackendPage>>(
    "/page/create-or-update",
    {
      method: "PUT",
      body: data as Record<string, unknown>,
      token: accessToken ?? undefined,
    },
  );

  updateTag("PAGES");
  return result;
};
