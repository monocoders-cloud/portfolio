"use server";

import { cosmic } from "@/cosmic/client";

const RESEND_KEY = process.env.RESEND_API_KEY!;
const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "change_to_your_email@example.com";

export type AddSubmissionType = {
  type: "form-submissions";
  title: string;
  metadata: {
    email: string;
    company: string;
    message: string;
  };
};

export async function addSubmission(comment: AddSubmissionType) {
  const { metadata, title } = comment;

  // Save to Cosmic
  const data = await cosmic.objects.insertOne(comment);

  // Build emails
  const submitterSubject = `Form submission received`;
  const submitterHTML = `
    Hello ${title},<br/><br/>
    This is a message to confirm that we have received your form submission:<br/><br/>
    Name: ${title}<br/>
    Email: ${metadata.email}<br/>
    Company: ${metadata.company}<br/>
    Message: ${metadata.message}<br/>
    <br/>
    A representative will be in touch with you soon.
  `;

  const adminSubject = `${title} submitted the form`;
  const adminHTML = `
    ${title} submitted the contact form:<br/><br/>
    Name: ${title}<br/>
    Email: ${metadata.email}<br/>
    Company: ${metadata.company}<br/>
    Message: ${metadata.message}<br/>
  `;

  // Send both emails
  await sendEmail({
    to: metadata.email,
    from: CONTACT_EMAIL,
    reply_to: CONTACT_EMAIL,
    subject: submitterSubject,
    html: submitterHTML,
  });

  await sendEmail({
    to: CONTACT_EMAIL,
    from: CONTACT_EMAIL,
    reply_to: metadata.email,
    subject: adminSubject,
    html: adminHTML,
  });

  return data;
}

async function sendEmail({
  from,
  to,
  subject,
  html,
  reply_to,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
  reply_to: string;
}) {
  // ⬇️ Import Resend only at runtime (server)
  const { Resend } = await import("resend");
  const resend = new Resend(RESEND_KEY);

  return resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo: reply_to,
  });
}
