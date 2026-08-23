"use client";

import type { ComponentType } from "react";

export function MDXRenderer({ Component }: { Component: ComponentType }) {
  return <Component />;
}
