export interface AvailabilityStatus {
  heading: string;
  detail: string;
}

function getNairobiDate(now: Date) {
  return new Date(now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }));
}

export function getAvailability(now: Date): AvailabilityStatus {
  const nairobiNow = getNairobiDate(now);
  const day = nairobiNow.getDay();
  const hour = nairobiNow.getHours();
  const workingDay = day >= 1 && day <= 5;
  const workingHour = hour >= 9 && hour < 18;

  if (workingDay && workingHour) {
    return {
      heading: "Currently Available",
      detail: "Usually replies same day"
    };
  }

  return {
    heading: "Replies Next Business Window",
    detail: "Best reach time: 9 AM - 6 PM EAT"
  };
}

