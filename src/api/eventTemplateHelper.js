// Helpers for the event templates: values proposed when an admin creates an
// event.
//
// A template keeps the start and the end of a sample event. Only its time of
// day and its duration are used: the day comes from the event being created.
// Times of day are read in the time zone of the browser, like the rest of the
// event form.

function pad(number) {
  return String(number).padStart(2, "0");
}

// A template without position has 0,0.
function hasLocation(template) {
  const location = template.location || {};
  return Boolean(location.lat) || Boolean(location.lng);
}

// "18:45" for a timestamp.
function timeOfDay(timestamp) {
  const date = new Date(timestamp * 1000);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Start and end on the day of dayTimestamp, at the given times of day
// ("HH:MM"). An end that is not after the start is on the next day. Returns
// null when a time is not valid.
function onDay(dayTimestamp, startTime, endTime) {
  const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const start = pattern.exec(startTime || "");
  const end = pattern.exec(endTime || "");
  if (!start || !end) {
    return null;
  }
  const startDate = new Date(dayTimestamp * 1000);
  startDate.setHours(Number(start[1]), Number(start[2]), 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(Number(end[1]), Number(end[2]), 0, 0);
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  return {
    startDate: Math.trunc(startDate.getTime() / 1000),
    endDate: Math.trunc(endDate.getTime() / 1000),
  };
}

export default {
  hasLocation,
  timeOfDay,
  onDay,
  // The fields of an event that a template sets: everything but the day, the
  // recurrence and the dues. The times are left alone when the template has
  // none.
  fieldsFor(event, template) {
    const fields = {
      name: template.name || "",
      type: template.type,
      description: template.description || "",
      locationName: template.locationName || "",
      uniformRequired: template.uniformRequired === 1 ? 1 : 0,
    };
    if (hasLocation(template)) {
      fields.location = {
        lat: template.location.lat,
        lng: template.location.lng,
      };
    }
    if (template.startDate > 0 && template.endDate >= template.startDate) {
      const times = onDay(
        event.startDate,
        timeOfDay(template.startDate),
        timeOfDay(template.endDate)
      );
      if (times) {
        fields.startDate = times.startDate;
        // The duration is kept even across a change of daylight saving time.
        fields.endDate =
          times.startDate + (template.endDate - template.startDate);
      }
    }
    return fields;
  },
  // A template made from the values of an event form.
  fromEvent(event, title) {
    const location = event.location || {};
    return {
      title: title.trim(),
      name: event.name || "",
      type: event.type,
      description: event.description || "",
      locationName: event.locationName || "",
      location: { lat: location.lat || 0, lng: location.lng || 0 },
      startDate: event.startDate || 0,
      endDate: event.endDate || 0,
      uniformRequired: event.uniformRequired === 1 ? 1 : 0,
    };
  },
  // Whether applying a template would erase something the admin typed.
  hasTypedValues(event) {
    return Boolean(
      (event.name || "").trim() ||
      (event.description || "").trim() ||
      (event.locationName || "").trim()
    );
  },
  // The template that has this title, whatever the case.
  findByTitle(templates, title) {
    const wanted = title.trim().toLowerCase();
    return templates.find((t) => t.title.toLowerCase() === wanted) || null;
  },
};
