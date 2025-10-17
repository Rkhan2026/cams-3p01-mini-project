export function getCompanyDisplayName(
  companyProfile,
  fallbackName = "Unknown Company"
) {
  try {
    if (!companyProfile) return fallbackName;

    // If it's a string, try parse JSON first, otherwise use string as name
    if (typeof companyProfile === "string") {
      try {
        const parsed = JSON.parse(companyProfile);
        companyProfile = parsed;
      } catch {
        return companyProfile || fallbackName;
      }
    }

    // If it's an object, check common name keys
    if (typeof companyProfile === "object") {
      return (
        companyProfile.companyName ||
        companyProfile.name ||
        companyProfile.company ||
        companyProfile.organizationName ||
        fallbackName
      );
    }

    return fallbackName;
  } catch (e) {
    return fallbackName;
  }
}

export default getCompanyDisplayName;
