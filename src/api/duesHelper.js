// Helpers for the dues (cotisations).
//
// A season follows the membership year of the Cercle culturel catalan: season
// 2026 runs from October 1st 2026 to September 30th 2027. It holds at most
// four collections: the Cercle in the autumn, then winter, spring and summer.

const KINDS = ["cercle", "winter", "spring", "summer"];
const COLLA_KINDS = ["winter", "spring", "summer"];

// Suggested amounts (in dollars) and dates when a season is created. The month
// is 0-based; yearOffset is relative to the year in which the season starts.
const DEFAULTS = {
  cercle: { dollars: 35, month: 9, yearOffset: 0 },
  winter: { dollars: 20, month: 0, yearOffset: 1 },
  spring: { dollars: 20, month: 3, yearOffset: 1 },
  summer: { dollars: 10, month: 6, yearOffset: 1 },
};

function intlLocale(locale) {
  if (locale === "en") {
    return "en-CA";
  }
  if (locale === "cat") {
    return "ca";
  }
  return "fr-CA";
}

function pad(number) {
  return String(number).padStart(2, "0");
}

// Value of an <input type="date"> for a timestamp, in local time.
function toDateInput(timestamp) {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export default {
  KINDS,
  COLLA_KINDS,
  // The season that contains a date: it starts on October 1st.
  currentSeason(date = new Date()) {
    return date.getMonth() >= 9 ? date.getFullYear() : date.getFullYear() - 1;
  },
  seasonLabel(season) {
    return `${season}-${season + 1}`;
  },
  // What is shown for a state. The API only knows paid, unpaid and exempt; the
  // date of the collection tells the rest:
  //   paid      -> paid, or paidAhead while the collection is still to come
  //   unpaid    -> toPay, or upcoming while the collection is still to come
  //   exempt    -> exempt
  displayStatus(status, dueDate, now = Date.now() / 1000) {
    const upcoming = dueDate > now;
    if (status === "paid") {
      return upcoming ? "paidAhead" : "paid";
    }
    if (status === "exempt") {
      return "exempt";
    }
    return upcoming ? "upcoming" : "toPay";
  },
  statusClass(displayStatus) {
    switch (displayStatus) {
      case "paid":
        return "is-success";
      case "paidAhead":
        return "is-success is-light";
      case "exempt":
        return "is-light";
      case "toPay":
        return "is-warning";
      default:
        return "is-info is-light";
    }
  },
  // Amounts are in cents. Cents are only shown when there are some.
  formatAmount(cents, locale) {
    const dollars = cents / 100;
    const digits = Number.isInteger(dollars) ? 0 : 2;
    const number = new Intl.NumberFormat(intlLocale(locale), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(dollars);
    return locale === "en" ? `$${number}` : `${number} $`;
  },
  formatDate(timestamp, locale) {
    return new Intl.DateTimeFormat(intlLocale(locale), {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(timestamp * 1000));
  },
  formatDateTime(timestamp, locale) {
    return new Intl.DateTimeFormat(intlLocale(locale), {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp * 1000));
  },
  // Timestamp of the value of an <input type="date">, at noon local time so
  // that the day stays the same in any nearby time zone. 0 if it is not a date.
  fromDateInput(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    if (!match) {
      return 0;
    }
    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      12
    );
    return Math.floor(date.getTime() / 1000);
  },
  // Rows of the form that creates or edits the collections of a season:
  // existing collections, completed with suggestions for the missing kinds.
  collectionForm(season, collections) {
    return KINDS.map(function (kind) {
      const existing = collections.find((c) => c.kind === kind);
      if (existing) {
        return {
          kind,
          dollars: existing.amount / 100,
          date: toDateInput(existing.dueDate),
        };
      }
      const suggestion = DEFAULTS[kind];
      return {
        kind,
        dollars: suggestion.dollars,
        date: `${season + suggestion.yearOffset}-${pad(
          suggestion.month + 1
        )}-15`,
      };
    });
  },
};
