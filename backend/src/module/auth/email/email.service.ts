import nodemailer, { Transporter } from "nodemailer";
import AppError from "@/utils/appError";
import { IEmailData } from "@/module/auth/email/email.type";

export interface IEmailService {
  send(to: string, subject: string, html: string): Promise<void>;
  sendGeneral(data: IEmailData): Promise<void>;
  sendOtp(to: string, otp: string): Promise<void>;
  sendWelcome(to: string, name: string): Promise<void>;
  sendPasswordResetConfirmation(to: string, name: string): Promise<void>;
  sendAccountVerificationOtp(to: string, otp: string): Promise<void>;
}

export class EmailService implements IEmailService {
  private transporter: Transporter;
  private readonly senderEmail = process.env.EMAIL_USER;
  private readonly senderName = process.env.EMAIL_SENDER_NAME || "JobFy";

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: this.senderEmail,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Gửi email chung (General)
  async sendGeneral(data: IEmailData): Promise<void> {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Xin chào ${data.name || "bạn"}!</h2>
        <p>${data.body}</p>
        ${
          data.verificationLink
            ? `<a href="${data.verificationLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Xác minh</a>`
            : ""
        }
      </div>
    `;
    await this.send(data.to, data.subject, html);
  }

  // Gửi mã OTP
  async sendOtp(to: string, otp: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">JobFy</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <h2 style="color: #111827; margin-top: 0; text-align: center;">Mã xác nhận OTP của bạn</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; text-align: center;">
            Bạn vừa yêu cầu lấy lại mật khẩu trên JobFy. Vui lòng sử dụng mã bảo mật dưới đây để xác thực:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f3f4f6; color: #4F46E5; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #ef4444; font-size: 14px; text-align: center; margin-top: 20px;">
            * Mã OTP này chỉ có hiệu lực trong vòng 5 phút. KHÔNG CHIA SẺ mã này cho bất kỳ ai!
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} JobFy. All rights reserved.</p>
        </div>
      </div>
    `;
    await this.send(to, "JobFy - Mã OTP Xác Thực Quên Mật Khẩu", html);
  }

  // Gửi mã OTP xác thực tài khoản
  async sendAccountVerificationOtp(to: string, otp: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">JobFy</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <h2 style="color: #111827; margin-top: 0; text-align: center;">Xác minh địa chỉ Email của bạn</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; text-align: center;">
            Chào mừng bạn đến với JobFy! Vui lòng nhập mã bảo mật dưới đây để xác minh địa chỉ email và hoàn tất việc tạo tài khoản:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #f3f4f6; color: #4F46E5; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="color: #ef4444; font-size: 14px; text-align: center; margin-top: 20px;">
            * Mã OTP này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ cho người khác.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} JobFy. All rights reserved.</p>
        </div>
      </div>
    `;
    await this.send(to, "JobFy - Mã OTP Xác Minh Tài Khoản", html);
  }

  // Gửi email chào mừng thành viên mới
  async sendWelcome(to: string, name: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">JobFy</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <h2 style="color: #111827; margin-top: 0;">Chào mừng ${name} đến với JobFy! 🎉</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Chúng tôi rất vui mừng khi bạn tham gia vào cộng đồng tuyển dụng JobFy. Dù bạn là ứng viên đang tìm kiếm cơ hội mới hay nhà tuyển dụng đang tìm kiếm nhân tài, JobFy luôn đồng hành cùng bạn.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Khám phá JobFy ngay</a>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} JobFy. All rights reserved.</p>
        </div>
      </div>
    `;
    await this.send(to, "Chào mừng đến với JobFy", html);
  }

  // Gửi thông báo mật khẩu đã được đổi thành công (bảo mật)
  async sendPasswordResetConfirmation(to: string, name: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">JobFy</h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <h2 style="color: #111827; margin-top: 0;">Thông báo đổi mật khẩu thành công 🔒</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Xin chào <strong>${name}</strong>,
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Mật khẩu tài khoản JobFy của bạn vừa được thay đổi thành công.
          </p>
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0;">
            <p style="color: #b45309; margin: 0; font-size: 14px;">
              <strong>Cảnh báo bảo mật:</strong> Nếu bạn KHÔNG thực hiện thao tác này, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi ngay lập tức để bảo vệ tài khoản.
            </p>
          </div>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Để đảm bảo an toàn, tất cả các phiên đăng nhập trước đó trên các thiết bị đã bị đăng xuất. Vui lòng sử dụng mật khẩu mới để đăng nhập lại.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} JobFy. All rights reserved.</p>
        </div>
      </div>
    `;
    await this.send(to, "JobFy - Cảnh báo Bảo mật: Mật khẩu đã được thay đổi", html);
  }

  // Phương thức gửi lõi (Core send method)
  async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.senderName}" <${this.senderEmail}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Email Service Error:", error);
      throw new AppError("Lỗi hệ thống khi gửi email.", 500);
    }
  }
}
