import { User } from '~/modules/Auth/Domain/User'
import { UserEmailSenderInterface } from '~/modules/Auth/Domain/UserEmailSenderInterface'
import { VerificationToken } from '~/modules/Auth/Domain/VerificationToken'
import nodemailer, { Transporter } from 'nodemailer'
import getT from 'next-translate/getT'
import { Translate } from 'next-translate'

export class NodemailerUserEmailSender implements UserEmailSenderInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly emailFromAddress: string,
    private readonly emailBrandName: string
  ) {}

  /**
   * Sends an email with the verification token to the user identified by its email
   * @param userEmail User email address
   * @param verificationToken Token to send in then email
   * @param locale User language
   */
  public async sendEmailVerificationEmail (
    userEmail: User['email'],
    verificationToken: VerificationToken,
    locale: string
  ): Promise<void> {
    const t = await getT(locale, 'email')
    const transporter = this.buildTransporter()

    const mailOptions = {
      from: {
        name: this.emailBrandName,
        address: this.emailFromAddress,
      },
      to: userEmail,
      subject: t('email_text_subject'),
      text: t('email_text_content', { verificationCode: verificationToken.token }),
      html: this.buildHTMLMessage(userEmail, verificationToken.token, t),
    }

    transporter.sendMail(mailOptions, (error, _info) => {
      if (error) {
        throw error
      }
    })
  }

  private buildHTMLMessage (
    userEmail: User['email'],
    token: VerificationToken['token'],
    t: Translate
  ): string {
    return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>${t('email_html_title')}</title>
        <style media="all" type="text/css">
          @media all {
            .btn-primary table td:hover {
              background-color: #6d3c11 !important;
            }
          
            .btn-primary a:hover {
              background-color: #6d3c11 !important;
              border-color: #6d3c11 !important;
            }
          }
          @media only screen and (max-width: 640px) {
            .main p,
          .main td,
          .main span {
              font-size: 16px !important;
            }
          
            .wrapper {
              padding: 8px !important;
            }
          
            .content {
              padding: 0 !important;
            }
          
            .container {
              padding: 0 !important;
              padding-top: 8px !important;
              width: 100% !important;
            }
          
            .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
          
            .btn table {
              max-width: 100% !important;
              width: 100% !important;
            }
          
            .btn a {
              font-size: 16px !important;
              max-width: 100% !important;
              width: 100% !important;
            }
          }
          @media all {
            .ExternalClass {
              width: 100%;
            }
          
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
          
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important;
            }
          
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
          }
        </style>
      </head>
      <body style="
        font-family: Helvetica,sans-serif;
        -webkit-font-smoothing: antialiased; 
        font-size: 16px; line-height: 1.3; 
        -ms-text-size-adjust: 100%; 
        -webkit-text-size-adjust: 100%; 
        background-color: #f4f5f6; 
        margin: 0;
        padding: 0;"
      >
        <table 
          role="presentation" 
          border="0" 
          cellpadding="0" 
          cellspacing="0" 
          class="body" 
          style="
            border-collapse: separate; 
            mso-table-lspace: 0pt; 
            mso-table-rspace: 0pt; 
            background-color: #f4f5f6; 
            width: 100%;
          " 
          width="100%" 
          bgcolor="#f4f5f6"
        >
          <tr>
            <td style="
              font-family: Helvetica, sans-serif; 
              font-size: 16px; 
              vertical-align: top;" 
              valign="top"
            >&nbsp;</td>
            <td class="container" style="
              font-family: Helvetica, sans-serif; 
              font-size: 16px; 
              vertical-align: top; 
              max-width: 600px; 
              padding: 0; 
              padding-top: 24px; 
              width: 600px; 
              margin: 0 auto;" 
              width="600" 
              valign="top"
            >
              <div class="content" style="
                box-sizing: border-box; 
                display: block; 
                margin: 0 auto; 
                max-width: 600px; 
                padding: 0;"
              >
                <span 
                  class="preheader" 
                  style="
                    color: transparent; 
                    display: none; 
                    height: 0; 
                    max-height: 0; 
                    max-width: 0; 
                    opacity: 0; 
                    overflow: hidden; 
                    mso-hide: all; 
                    visibility: hidden; 
                    width: 0;
                  "
                >
                  ${t('email_html_preview', { verificationCode: token })}
                </span>
                <table 
                  role="presentation" 
                  border="0" 
                  cellpadding="0" 
                  cellspacing="0" 
                  class="main" 
                  style="
                    border-collapse: separate; 
                    mso-table-lspace: 0pt; 
                    mso-table-rspace: 0pt; 
                    background: #ffffff; 
                    border: 1px solid #eaebed; 
                    border-radius: 16px; 
                    width: 100%;
                  " 
                  width="100%"
                >
                  <tr>
                    <td class="wrapper" style="
                      font-family: Helvetica, sans-serif; 
                      font-size: 16px; 
                      vertical-align: top; 
                      box-sizing: border-box; 
                      padding: 24px;
                      " 
                      valign="top"
                    >
                      <p style="
                        font-family: Helvetica, sans-serif; 
                        font-size: 16px; 
                        font-weight: normal; 
                        margin: 0; 
                        margin-bottom: 16px;
                      "
                      >
                        ${t('email_html_content_first_paragraph', { userEmail })}
                      </p>
                      <p style="
                        font-family: Helvetica, sans-serif; 
                        font-size: 16px; 
                        font-weight: normal; 
                        margin: 0; 
                        margin-bottom: 16px;"
                      >
                        ${t('email_html_content_second_paragraph')}
                      </p>
                      <table 
                        role="presentation" 
                        border="0" 
                        cellpadding="0" 
                        cellspacing="0" 
                        class="btn btn-primary" 
                        style="
                          border-collapse: separate; 
                          mso-table-lspace: 0pt; 
                          mso-table-rspace: 0pt; 
                          box-sizing: border-box; 
                          width: 100%; 
                          min-width: 100%;
                        "
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td 
                              align="left" 
                              style="
                                font-family: Helvetica, sans-serif; 
                                font-size: 16px; 
                                vertical-align: top; 
                                padding-bottom: 16px;
                              " 
                              valign="top"
                            >
                              <table 
                                role="presentation" 
                                border="0" 
                                cellpadding="0" 
                                cellspacing="0" 
                                style="
                                  border-collapse: separate; 
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt; 
                                  width: auto;
                                "
                              >
                                <tbody>
                                  <tr>
                                    <td 
                                      style="
                                        font-family: Helvetica, sans-serif; 
                                        font-size: 16px; 
                                        vertical-align: top; 
                                        border-radius: 4px; 
                                        text-align: center; 
                                        background-color: #a06c3f;
                                      " 
                                      valign="top" 
                                      align="center" 
                                      bgcolor="#0867ec"
                                    ><span 
                                      style="
                                        border: solid 2px #a06c3f; 
                                        border-radius: 4px; 
                                        box-sizing: border-box; 
                                        cursor: pointer; 
                                        display: inline-block; 
                                        font-size: 16px; 
                                        font-weight: bold;
                                        margin: 0; 
                                        padding: 12px 24px; 
                                        text-decoration: none; 
                                        text-transform: capitalize; 
                                        background-color: #a06c3f; 
                                        border-color: #a06c3f; 
                                        color: #ffffff;"
                                      >
                                        ${token}
                                      </span> 
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p style="
                        font-family: Helvetica, sans-serif;
                        font-size: 16px; 
                        font-weight: normal; 
                        margin: 0; 
                        margin-bottom: 16px;"
                      >
                        ${t('email_html_content_third_paragraph')}
                      </p>
                      <p style="
                        font-family: Helvetica, sans-serif; 
                        font-size: 16px; 
                        font-weight: normal; 
                        margin: 0; margin-bottom: 16px;
                      ">
                        ${t('email_html_content_fourth_paragraph')}
                      </p>
                    </td>
                  </tr>
                </table>
                <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%;">
                  <table 
                    role="presentation" 
                    border="0" 
                    cellpadding="0" 
                    cellspacing="0" 
                    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" 
                    width="100%"
                  >
                    <tr>
                      <td 
                        class="content-block" 
                        style="
                          font-family: Helvetica, sans-serif; 
                          vertical-align: top;
                           color: #9a9ea6; 
                           font-size: 16px; 
                           text-align: center;
                         " 
                        valign="top" 
                        align="center"
                      >
                        <span 
                          class="apple-link" 
                          style="color: #9a9ea6; font-size: 16px; text-align: center;"
                        >
                          ${t('email_html_footer_first_paragraph')}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td 
                        class="content-block powered-by" 
                        style="
                          font-family: Helvetica, sans-serif; 
                          vertical-align: top; 
                          color: #9a9ea6; 
                          font-size: 16px; 
                          text-align: center;
                        " 
                        valign="top" 
                        align="center"
                      >
                        ${t('email_html_footer_second_paragraph')}
                      </td>
                    </tr>
                  </table>
                </div>
    
            </div>
            </td>
            <td style="
              font-family: Helvetica, sans-serif; 
              font-size: 16px; 
              vertical-align: top;
              " 
              valign="top"
            >&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>`
  }

  private buildTransporter (): Transporter {
    const { env } = process

    const emailHost = env.EMAIL_HOST
    const emailUser = env.EMAIL_USER
    const emailPass = env.EMAIL_PASSWORD
    const emailPort = env.EMAIL_PORT
    const emailService = env.EMAIL_SERVICE

    if (
      !emailPort ||
      !emailHost ||
      !emailUser ||
      !emailPass ||
      !emailService
    ) {
      throw Error('Missing ENV variables required to build an email transporter')
    }

    if (isNaN(parseInt(emailPort))) {
      throw Error('Invalid value for EMAIL_PORT [integer value required]')
    }

    return nodemailer.createTransport({
      service: emailService,
      host: emailHost,
      secure: false,
      port: parseInt(emailPort),
      auth: { user: emailUser, pass: emailPass },
      tls: { rejectUnauthorized: false },
    })
  }
}
