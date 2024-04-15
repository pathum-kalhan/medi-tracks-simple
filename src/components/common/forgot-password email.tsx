interface EmailTemplateProps {
  name: string;
  OTP: number;
}

export const PasswordForgotEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ name, OTP }) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      You are one step away from resetting your password. Please use the OTP
      below to reset your password.
    </p>
    <h2>{OTP}</h2>
    <p>
      If you did not request a password reset, please ignore this email or
      contact us.
    </p>
  </div>
);
