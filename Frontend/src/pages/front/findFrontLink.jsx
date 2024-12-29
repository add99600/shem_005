export default function findFrontLink(ids) {
  switch (ids) {
    case "shem002":
      return "/she/safety/chemical/update/shem002_new";
      case "shem003":
        return "/she/safety/health/update/shem003_new";
    case "shem005":
      return "/she/safety/work/update/dev_test_shem005";
    case "shem007":
      return "/she/safety/tool/update/shem007_new";
      case "shem011":
        return "/she/safety/menual/update/shem011_new";
    case "shem014":
      return "/she/safety/checklist/update/shem014_new";
    case "shem016":
      return "/she/safety/option/update/shem016_new";
    case "shem018":
      return "/she/safety/tbm/update/shem018_new";
    case "shem020":
      return "/she/safety/inspect/update/shem020_new";
    case "she_notice":
      return "/she/safety/notification/update/she_notice_new";
    case "she_reference":
      return "/she/safety/dataroom/update/she_reference_new";
    default:
      return "/she/home";
  }
}
