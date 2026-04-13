import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Save to database
    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    });

    // Send notification email via Resend (optional — swallow errors)
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      getResend().emails
        .send({
          from: "AgentShelf <noreply@agentshelf.io>",
          to: process.env.CONTACT_EMAIL,
          replyTo: email,
          subject: `[Contact] ${subject}`,
          html: `
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p>${message.replace(/\n/g, "<br/>")}</p>
          `,
        })
        .catch((err) => console.error("[Contact email error]", err));
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
