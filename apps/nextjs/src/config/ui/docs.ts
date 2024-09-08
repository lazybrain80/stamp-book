import type { DocsConfig } from "~/types";

export const getDocsConfig = (_lang: string): DocsConfig => {
  if (_lang === "ko") {
    return {
      mainNav: [
        {
          title: "문서",
          href: `/ko/docs`,
        },
        {
          title: "가이드",
          href: `/ko/guides`,
        },
      ],
      sidebarNav: [
        {
          id: "getting-started",
          title: "시작하기",
          items: [
            {
              title: "서비스 소개",
              href: `/ko/docs`,
            },
          ],
        },
        {
          id: "user-guide",
          title: "사용자 가이드",
          items: [
            {
              title: "워터마크 생성",
              href: `/ko/docs/create-watermark`,
            },
            {
              title: "워터마크 검증",
              href: `/ko/docs/validate-watermark`,
            },
            {
              title: "워터마크 생성이력",
              href: `/ko/docs/create-history`,
            },
            {
              title: "워터마크 검증이력",
              href: `/ko/docs/validate-history`,
            },
          ],
        },
      ],
    };
  }

  return {
    mainNav: [
      {
        title: "Documentation",
        href: `/en/docs`,
      },
      {
        title: "Guides",
        href: `/en/guides`,
      },
    ],
    sidebarNav: [
      {
        id: "getting-started",
        title: "Getting Started",
        items: [
          {
            title: "Introduction",
            href: `/en/docs`,
          },
        ],
      },
      {
        id: "user-guide",
        title: "User Guide",
        items: [
          {
            title: "Create Watermark",
            href: `/en/docs/create-watermark`,
          },
          {
            title: "Validate Watermark",
            href: `/en/docs/validate-watermark`,
          },
          {
            title: "Creation History",
            href: `/en/docs/create-history`,
          },
          {
            title: "Validation History",
            href: `/en/docs/validate-history`,
          },
        ],
      },
    ],
  };
};
