/**
 * @author Chad Nelson <chad.nelson@vafb.com>
 * Modified by Joseph Call <jay.call@vafb.com> to work
 * with change request notifications
 */
import fs from "fs";
import nodemailer from "nodemailer";

class Email {
  constructor(emailContent) {
    // Create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport({
      host: "webmail.vafb.com",
      port: 25,
      secure: false, // true for secure port, false for other ports
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false, // Bypass self-signed certificate error https://github.com/nodemailer/smtp-server/issues/115
      },
    });

    // send email to self
    this.from = emailContent.from;
    this.to = emailContent.from;

    this.subject = `Test email`;
    this.bodyText = `Hello
      \n
      This is a test`;
    this.bodyHtml = `<div>Hello</div>
      <br />
      This is a test`;
  }

  async send() {
    try {
      let info = await this.transporter.sendMail({
        from: this.from,
        to: this.to,
        subject: this.subject,
        text: this.bodyText,
        html: this.bodyHtml,
      });

      return info;
    } catch (error) {
      console.error("Email send error:", error);
    }
  }

  async save(emailFilePath) {
    // Save text version of email to the deploy registry folder.
    const text = `from: ${this.from}\n\n
      to: ${this.to}\n\n
      subject: ${this.subject}\n\n
      text: ${this.bodyText}\n\n
      html: ${this.bodyHtml}`;

    fs.writeFile(emailFilePath, text, function (error) {
      if (error) {
        throw error;
      }

      console.log("Email saved here:", emailFilePath);
    });
  }
}

module.exports = {
  Email: Email,
};
