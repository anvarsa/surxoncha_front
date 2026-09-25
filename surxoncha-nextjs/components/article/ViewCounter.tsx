"use client";

import { useEffect, useRef } from "react";

export function ViewCounter({ articleId }: { articleId: number }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch(`/api/articles/${articleId}/view`, { method: "POST" }).catch(() => {
      // ko'rishlar sonini oshirish muvaffaqiyatsiz bo'lsa ham, o'quvchiga bildirmaymiz
    });
  }, [articleId]);

  return null;
}
