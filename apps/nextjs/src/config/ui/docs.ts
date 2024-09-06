import type { DocsConfig } from "~/types";

export const getDocsConfig = (_lang: string): DocsConfig => {
  return {
    mainNav: [
      {
        title: "Documentation",
        href: `/docs`,
      },
      {
        title: "Guides",
        href: `/guides`,
      },
    ],
    sidebarNav: [
      {
        id: "docs",
        title: "시작하기",
        items: [
          {
            title: "서비스 소개",
            href: `/docs`,
          },
        ],
      },
      {
        id: "user-guide",
        title: "사용자 가이드",
        items: [
          {
            title: "워터마크 생성",
            href: `/docs/create-watermark`,
          },
          {
            title: "워터마크 검증",
            href: `/docs/validate-watermark`,
          },
          {
            title: "워터마크 생성이력",
            href: `/docs/create-history`,
          },
          {
            title: "워터마크 검증이력",
            href: `/docs/validate-history`,
          },
        ],
      },
    ],
  };
};
