import { kv, pentagon } from "./db.ts";

async function getAllKvData(show: boolean) {
  console.log("calling getAllKvData");

  if (show) {
    const it = kv.list({ prefix: [] });
    for await (const { key, value } of it) {
      console.log("key=value", { key, value });
    }
  }
}

async function doMeetings() {
  console.log("calling doMeetings");
  const meeting = await pentagon.meeting.create({
    data: {
      title: Math.random().toString(),
      description: Math.random().toString(),
      userId: Math.random(),
      duration: Math.random() * 28,
      price: Math.random() * 100,
    },
  });
  console.log({ meeting });
  const meetings = await pentagon.meeting.findMany({});
  console.log({ meetings });
}

async function doUser() {
  console.log("calling doUser");
  const genders = ["male", "female", "other"];
  const genderIndex = Math.floor(Math.random() * 3);

  const user = await pentagon.users.create({
    data: {
      id: Math.random(),
      username: Math.random().toString(),
      firstName: Math.random().toString(),
      lastName: Math.random().toString(),
      nickname: Math.random().toString(),
      gender: genders[genderIndex],
    },
  });

  console.log({ user });

  const users = await pentagon.users.findMany({});
  console.log({ users });
}

async function doBookingReference() {
  console.log("calling doBookingReference");
  const bookingReference = await pentagon.bookingReference.create({
    data: {
      meetingId: crypto.randomUUID(),
      bookingId: crypto.randomUUID(),
      type: "meeting",
    },
  });

  console.log({ bookingReference });

  const references = await pentagon.bookingReference.findMany({});
  console.log({ references });

  // fails with 'findMany' to when using the where clause with an 'index' field
  const findRef = await pentagon.bookingReference.findFirst({
    where: {
      meetingId: bookingReference.meetingId,
    },
  });

  console.log({ findRef });
}

async function doAgreedTerms() {
  console.log("calling doAgreedTerms");

  const agreedTerms = await pentagon.agreedTerms.create({
    data: {
      id: Math.random(),
    },
  });

  console.log({ agreedTerms });

  const agreements = await pentagon.agreedTerms.findMany({});
  console.log({ agreements });
}

async function main() {
  const showAll = false;
  await Promise.all([
    getAllKvData(showAll),
    doMeetings(),
    doBookingReference(),
    doAgreedTerms(),
    doUser(),
  ]);
}

main().catch(console.error);
