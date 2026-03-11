export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin", "super_admin"],
  "/member(.*)": ["member", "pastor", "admin", "cell_leader"],
  "/pastor(.*)": ["pastor", "admin", "super_admin"],
  "/family(.*)": ["member", "family_head", "admin"],
  "/list/pastors": ["admin", "super_admin"],
  "/list/members": ["admin", "pastor", "cell_leader"],
  "/list/family-heads": ["admin", "pastor"],
  "/list/ministries": ["admin", "pastor", "ministry_leader"],
  "/list/cell-groups": ["admin", "pastor", "cell_leader"],
  "/list/services": ["admin", "pastor", "ministry_leader"],
  "/list/contributions": ["admin", "pastor", "finance_leader"],
  "/list/events": ["admin", "pastor", "ministry_leader", "cell_leader", "member"],
  "/list/prayer-requests": ["admin", "pastor", "prayer_leader", "member"],
  "/list/announcements": ["admin", "pastor", "ministry_leader", "cell_leader", "member"],
  "/list/attendance": ["admin", "pastor", "cell_leader"],
  "/list/funds": ["admin", "pastor", "finance_leader"],
  "/list/soul-winning": ["admin", "pastor", "evangelism_leader", "member"],
  "/list/outreach": ["admin", "pastor", "outreach_leader", "member"],
  "/dashboard": ["admin", "pastor", "ministry_leader", "cell_leader", "member"],
  "/reports": ["admin", "super_admin", "pastor"],
  "/settings": ["admin", "super_admin"],
};
