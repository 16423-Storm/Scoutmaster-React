import { useScreenType } from "../../scripts/multipageutils";
import { Blocker499 } from "./blocker";

export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
    const isDesktop = useScreenType() === "desktop";

    if (isDesktop) {
        return (
            <>
                <Blocker499 />

                <div
                    className={"desktop-privacy-popup"}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="privacy-title"
                    style={{
                        width: "60vw",
                        height: "75vh",
                        backgroundColor: "#be0000",
                    }}
                >
                    <header
                        className={"desktop-privacy-header"}
                        style={{ backgroundColor: "#be0000" }}
                    >
                        <h1
                            id="privacy-title"
                            style={{
                                margin: 0,
                                color: "white",
                                fontSize: "1.8rem",
                                fontWeight: 600,
                            }}
                        >
                            Privacy Policy
                        </h1>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            Effective October 25, 2026
                        </p>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            Learn how Scoutmaster handles account information
                            and scouting records.
                        </p>
                    </header>

                    <div className={"desktop-signup-policybody"}>
                        <section>
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to Scoutmaster, a scouting tool for
                                FIRST Tech Challenge (FTC) robotics teams. This
                                Privacy Policy explains what information we
                                collect, how we use and share it, and the
                                choices available to you when using Scoutmaster.
                            </p>
                            <p>
                                Scoutmaster is independently developed and
                                operated. We aim to collect only the information
                                needed to provide accounts and synchronize
                                scouting records between teammates.
                            </p>
                        </section>

                        <section>
                            <h2>2. Age Requirement</h2>
                            <p>
                                Scoutmaster is intended for individuals aged 13
                                and older. You must be at least 13 years old to
                                create an account or use the service. Children
                                under 13 are not permitted to use Scoutmaster or
                                create an account.
                            </p>
                            <p>
                                Scoutmaster does not currently use a separate
                                age verification process. If we become aware
                                that a user under 13 has created an account, we
                                will take appropriate steps to address the
                                situation, including restricting the account and
                                deleting personal information where required by
                                applicable law.
                            </p>
                            <p>
                                If you believe someone under 13 is using
                                Scoutmaster, please contact us at
                                sdhs_stormbot16423@outlook.com.
                            </p>
                        </section>

                        <section>
                            <h2>3. Information We Collect</h2>
                            <p>
                                Scoutmaster collects information needed to
                                provide the service, including:
                            </p>
                            <ul>
                                <li>
                                    <strong>Email address:</strong> Used for
                                    account authentication and access to
                                    Scoutmaster.
                                </li>
                                <li>
                                    <strong>Scouting information:</strong> Robot
                                    performance observations, scouting notes,
                                    team strategies, and related records entered
                                    by users.
                                </li>
                            </ul>
                            <p>
                                Please avoid including unnecessary personal or
                                sensitive information about yourself or others
                                in scouting notes.
                            </p>
                        </section>

                        <section>
                            <h2>4. How We Use Information</h2>
                            <p>We use information to:</p>
                            <ul>
                                <li>Create and authenticate user accounts.</li>
                                <li>
                                    Store and synchronize scouting records
                                    between members of the same team.
                                </li>
                                <li>
                                    Maintain the service and its account and
                                    database access controls.
                                </li>
                                <li>
                                    Send authentication related emails when
                                    needed to support account access.
                                </li>
                            </ul>
                            <p>
                                Scoutmaster is not intended to use your
                                information for advertising or promotional
                                emails.
                            </p>
                        </section>

                        <section>
                            <h2>5. How Information Is Shared</h2>
                            <p>
                                Scoutmaster is designed to let members of the
                                same team access shared scouting records.
                                Database access restrictions are intended to
                                prevent members of one team from accessing
                                another team's records.
                            </p>
                            <p>
                                Other authorized members of your team may be
                                able to view scouting information you enter into
                                shared records. Please consider this before
                                submitting information.
                            </p>
                            <p>
                                Scoutmaster uses the following service
                                providers:
                            </p>
                            <ul>
                                <li>
                                    <strong>Supabase:</strong> Provides account
                                    authentication and cloud database services.
                                </li>
                                <li>
                                    <strong>Render:</strong> Provides
                                    application hosting.
                                </li>
                                <li>
                                    <strong>Resend:</strong> Sends
                                    authentication-related emails.
                                </li>
                            </ul>
                            <p>
                                These providers may process information as
                                needed to provide their services. Their handling
                                of information is also subject to their
                                applicable terms and privacy practices.
                            </p>
                            <p>
                                We do not intend to sell users' personal
                                information. Information may also be disclosed
                                where required by law or in response to valid
                                legal requests.
                            </p>
                        </section>

                        <section>
                            <h2>6. Data Storage and International Use</h2>
                            <p>
                                Scoutmaster uses cloud services to store account
                                and scouting information and synchronize records
                                between teammates.
                            </p>
                            <p>
                                Scoutmaster is available internationally.
                                Depending on the services involved, information
                                may be processed or stored in countries other
                                than your own, where different privacy laws may
                                apply. We do not specify a guaranteed storage
                                country in this policy.
                            </p>
                        </section>

                        <section>
                            <h2>7. Data Retention</h2>
                            <p>
                                Scoutmaster's intended practice is to retain
                                scouting records for the relevant robotics
                                season. At the end of a season, older records
                                are removed manually rather than automatically.
                                Until removed, these records may remain stored
                                and available to authorized team members.
                            </p>
                            <p>
                                Account information is retained while needed to
                                provide the account and service, unless it is
                                deleted.
                            </p>
                            <p>
                                We have not verified the retention period for
                                copies that may remain in service-provider
                                backups. Deletion from the active service may
                                therefore not mean immediate removal from every
                                backup.
                            </p>
                        </section>

                        <section>
                            <h2>8. Account and Data Deletion</h2>
                            <p>
                                Users can delete their accounts through the
                                account deletion functionality provided by
                                Scoutmaster.
                            </p>
                            <p>
                                Deleting an account removes the account, but
                                scouting records shared with teammates may
                                remain available to the team. Account deletion
                                does not remove every record associated with the
                                user's previous activity.
                            </p>
                            <p>
                                Copies retained in backups may not be removed
                                immediately. Where applicable law gives you a
                                right to request deletion of personal
                                information, you may contact
                                sdhs_stormbot16423@outlook.com for assistance.
                            </p>
                        </section>

                        <section>
                            <h2>9. Security</h2>
                            <p>
                                Scoutmaster uses authentication and database
                                access restrictions to help protect accounts and
                                limit access to stored information.
                            </p>
                            <p>
                                No online service or method of electronic
                                storage can be guaranteed to be completely
                                secure. We cannot promise that information will
                                never be accessed, disclosed, altered, or lost
                                without authorization.
                            </p>
                        </section>

                        <section>
                            <h2>10. Cookies and Analytics</h2>
                            <p>
                                This policy does not identify a separate
                                analytics or advertising service currently used
                                by Scoutmaster. Hosting, authentication, and
                                application infrastructure may process technical
                                information as part of providing their services.
                            </p>
                            <p>
                                If Scoutmaster introduces additional cookies,
                                analytics, advertising technologies, or other
                                data collection practices, this policy will be
                                updated as appropriate.
                            </p>
                        </section>

                        <section>
                            <h2>11. Your Privacy Choices</h2>
                            <p>
                                You can choose what scouting information you
                                enter into Scoutmaster and should avoid
                                including unnecessary personal information in
                                shared notes.
                            </p>
                            <p>
                                Depending on the laws that apply to you, you may
                                have rights to request access to, correction of,
                                or deletion of your personal information, or to
                                withdraw consent where consent is the basis for
                                processing.
                            </p>
                            <p>
                                To ask a privacy question or make a request,
                                contact sdhs_stormbot16423@outlook.com.
                            </p>
                        </section>

                        <section>
                            <h2>12. Applicable Privacy Laws</h2>
                            <p>
                                Scoutmaster is independently operated from
                                Canada and is intended for international use.
                                The privacy laws that apply may depend on where
                                you live, the nature of the service, and how
                                your information is handled.
                            </p>
                            <p>
                                We will handle personal information in
                                accordance with applicable legal requirements.
                                This policy is not a guarantee that every legal
                                requirement in every country has been
                                independently assessed or satisfied.
                            </p>
                        </section>

                        <section>
                            <h2>13. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy as Scoutmaster
                                changes or as legal requirements evolve. The
                                updated version will be published with a revised
                                effective date. Where required, we will provide
                                notice or obtain consent for material changes.
                            </p>
                        </section>

                        <section>
                            <h2>14. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy,
                                the information Scoutmaster handles, or a
                                privacy request, contact us at:
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:sdhs_stormbot16423@outlook.com">
                                    sdhs_stormbot16423@outlook.com
                                </a>
                            </p>
                        </section>
                    </div>

                    <footer className={"desktop-privacy-footer"}>
                        <button
                            className={"desktop-privacy-button"}
                            onClick={onClose}
                            type="button"
                        >
                            Return
                        </button>
                    </footer>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />

                <div
                    className={"phone-privacy-popup"}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="privacy-title"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#be0000",
                    }}
                >
                    <header
                        className={"phone-privacy-header"}
                        style={{ backgroundColor: "#be0000" }}
                    >
                        <h1
                            id="privacy-title"
                            style={{
                                margin: 0,
                                color: "white",
                                fontSize: "1.8rem",
                                fontWeight: 600,
                            }}
                        >
                            Privacy Policy
                        </h1>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            Effective October 25, 2026
                        </p>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            Learn how Scoutmaster handles account information
                            and scouting records.
                        </p>
                    </header>

                    <div className={"phone-signup-policybody"}>
                        <section>
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to Scoutmaster, a scouting tool for
                                FIRST Tech Challenge (FTC) robotics teams. This
                                Privacy Policy explains what information we
                                collect, how we use and share it, and the
                                choices available to you when using Scoutmaster.
                            </p>
                            <p>
                                Scoutmaster is independently developed and
                                operated. We aim to collect only the information
                                needed to provide accounts and synchronize
                                scouting records between teammates.
                            </p>
                        </section>

                        <section>
                            <h2>2. Age Requirement</h2>
                            <p>
                                Scoutmaster is intended for individuals aged 13
                                and older. You must be at least 13 years old to
                                create an account or use the service. Children
                                under 13 are not permitted to use Scoutmaster or
                                create an account.
                            </p>
                            <p>
                                Scoutmaster does not currently use a separate
                                age verification process. If we become aware
                                that a user under 13 has created an account, we
                                will take appropriate steps to address the
                                situation, including restricting the account and
                                deleting personal information where required by
                                applicable law.
                            </p>
                            <p>
                                If you believe someone under 13 is using
                                Scoutmaster, please contact us at
                                sdhs_stormbot16423@outlook.com.
                            </p>
                        </section>

                        <section>
                            <h2>3. Information We Collect</h2>
                            <p>
                                Scoutmaster collects information needed to
                                provide the service, including:
                            </p>
                            <ul>
                                <li>
                                    <strong>Email address:</strong> Used for
                                    account authentication and access to
                                    Scoutmaster.
                                </li>
                                <li>
                                    <strong>Scouting information:</strong> Robot
                                    performance observations, scouting notes,
                                    team strategies, and related records entered
                                    by users.
                                </li>
                            </ul>
                            <p>
                                Please avoid including unnecessary personal or
                                sensitive information about yourself or others
                                in scouting notes.
                            </p>
                        </section>

                        <section>
                            <h2>4. How We Use Information</h2>
                            <p>We use information to:</p>
                            <ul>
                                <li>Create and authenticate user accounts.</li>
                                <li>
                                    Store and synchronize scouting records
                                    between members of the same team.
                                </li>
                                <li>
                                    Maintain the service and its account and
                                    database access controls.
                                </li>
                                <li>
                                    Send authentication related emails when
                                    needed to support account access.
                                </li>
                            </ul>
                            <p>
                                Scoutmaster is not intended to use your
                                information for advertising or promotional
                                emails.
                            </p>
                        </section>

                        <section>
                            <h2>5. How Information Is Shared</h2>
                            <p>
                                Scoutmaster is designed to let members of the
                                same team access shared scouting records.
                                Database access restrictions are intended to
                                prevent members of one team from accessing
                                another team's records.
                            </p>
                            <p>
                                Other authorized members of your team may be
                                able to view scouting information you enter into
                                shared records. Please consider this before
                                submitting information.
                            </p>
                            <p>
                                Scoutmaster uses the following service
                                providers:
                            </p>
                            <ul>
                                <li>
                                    <strong>Supabase:</strong> Provides account
                                    authentication and cloud database services.
                                </li>
                                <li>
                                    <strong>Render:</strong> Provides
                                    application hosting.
                                </li>
                                <li>
                                    <strong>Resend:</strong> Sends
                                    authentication-related emails.
                                </li>
                            </ul>
                            <p>
                                These providers may process information as
                                needed to provide their services. Their handling
                                of information is also subject to their
                                applicable terms and privacy practices.
                            </p>
                            <p>
                                We do not intend to sell users' personal
                                information. Information may also be disclosed
                                where required by law or in response to valid
                                legal requests.
                            </p>
                        </section>

                        <section>
                            <h2>6. Data Storage and International Use</h2>
                            <p>
                                Scoutmaster uses cloud services to store account
                                and scouting information and synchronize records
                                between teammates.
                            </p>
                            <p>
                                Scoutmaster is available internationally.
                                Depending on the services involved, information
                                may be processed or stored in countries other
                                than your own, where different privacy laws may
                                apply. We do not specify a guaranteed storage
                                country in this policy.
                            </p>
                        </section>

                        <section>
                            <h2>7. Data Retention</h2>
                            <p>
                                Scoutmaster's intended practice is to retain
                                scouting records for the relevant robotics
                                season. At the end of a season, older records
                                are removed manually rather than automatically.
                                Until removed, these records may remain stored
                                and available to authorized team members.
                            </p>
                            <p>
                                Account information is retained while needed to
                                provide the account and service, unless it is
                                deleted.
                            </p>
                            <p>
                                We have not verified the retention period for
                                copies that may remain in service-provider
                                backups. Deletion from the active service may
                                therefore not mean immediate removal from every
                                backup.
                            </p>
                        </section>

                        <section>
                            <h2>8. Account and Data Deletion</h2>
                            <p>
                                Users can delete their accounts through the
                                account deletion functionality provided by
                                Scoutmaster.
                            </p>
                            <p>
                                Deleting an account removes the account, but
                                scouting records shared with teammates may
                                remain available to the team. Account deletion
                                does not remove every record associated with the
                                user's previous activity.
                            </p>
                            <p>
                                Copies retained in backups may not be removed
                                immediately. Where applicable law gives you a
                                right to request deletion of personal
                                information, you may contact
                                sdhs_stormbot16423@outlook.com for assistance.
                            </p>
                        </section>

                        <section>
                            <h2>9. Security</h2>
                            <p>
                                Scoutmaster uses authentication and database
                                access restrictions to help protect accounts and
                                limit access to stored information.
                            </p>
                            <p>
                                No online service or method of electronic
                                storage can be guaranteed to be completely
                                secure. We cannot promise that information will
                                never be accessed, disclosed, altered, or lost
                                without authorization.
                            </p>
                        </section>

                        <section>
                            <h2>10. Cookies and Analytics</h2>
                            <p>
                                This policy does not identify a separate
                                analytics or advertising service currently used
                                by Scoutmaster. Hosting, authentication, and
                                application infrastructure may process technical
                                information as part of providing their services.
                            </p>
                            <p>
                                If Scoutmaster introduces additional cookies,
                                analytics, advertising technologies, or other
                                data collection practices, this policy will be
                                updated as appropriate.
                            </p>
                        </section>

                        <section>
                            <h2>11. Your Privacy Choices</h2>
                            <p>
                                You can choose what scouting information you
                                enter into Scoutmaster and should avoid
                                including unnecessary personal information in
                                shared notes.
                            </p>
                            <p>
                                Depending on the laws that apply to you, you may
                                have rights to request access to, correction of,
                                or deletion of your personal information, or to
                                withdraw consent where consent is the basis for
                                processing.
                            </p>
                            <p>
                                To ask a privacy question or make a request,
                                contact sdhs_stormbot16423@outlook.com.
                            </p>
                        </section>

                        <section>
                            <h2>12. Applicable Privacy Laws</h2>
                            <p>
                                Scoutmaster is independently operated from
                                Canada and is intended for international use.
                                The privacy laws that apply may depend on where
                                you live, the nature of the service, and how
                                your information is handled.
                            </p>
                            <p>
                                We will handle personal information in
                                accordance with applicable legal requirements.
                                This policy is not a guarantee that every legal
                                requirement in every country has been
                                independently assessed or satisfied.
                            </p>
                        </section>

                        <section>
                            <h2>13. Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy as Scoutmaster
                                changes or as legal requirements evolve. The
                                updated version will be published with a revised
                                effective date. Where required, we will provide
                                notice or obtain consent for material changes.
                            </p>
                        </section>

                        <section>
                            <h2>14. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy,
                                the information Scoutmaster handles, or a
                                privacy request, contact us at:
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:sdhs_stormbot16423@outlook.com">
                                    sdhs_stormbot16423@outlook.com
                                </a>
                            </p>
                        </section>
                    </div>

                    <footer className={"phone-privacy-footer"}>
                        <button
                            className={"phone-privacy-button"}
                            onClick={onClose}
                            type="button"
                        >
                            Return
                        </button>
                    </footer>
                </div>
            </>
        );
    }
}

export function TOS({ onClose }: { onClose: () => void }) {
    const isDesktop = useScreenType() === "desktop";

    if (isDesktop) {
        return (
            <>
                <Blocker499 />
                <div
                    className={"desktop-privacy-popup"}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tos-title"
                    style={{
                        width: "60vw",
                        height: "75vh",
                        backgroundColor: "#be0000",
                    }}
                >
                    <header
                        className={"desktop-privacy-header"}
                        style={{ backgroundColor: "#be0000" }}
                    >
                        <h1
                            id="tos-title"
                            style={{
                                margin: 0,
                                color: "white",
                                fontSize: "1.8rem",
                                fontWeight: 600,
                            }}
                        >
                            Terms of Service
                        </h1>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            Effective October 25, 2026
                        </p>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            The rules and conditions for using Scoutmaster.
                        </p>
                    </header>

                    <div className={"desktop-signup-policybody"}>
                        <section>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                Welcome to Scoutmaster, an independently
                                operated scouting tool for FIRST Tech Challenge
                                (FTC) robotics teams. These Terms of Service
                                explain the rules for using Scoutmaster.
                            </p>
                            <p>
                                By creating an account or using Scoutmaster, you
                                agree to these terms. If you do not agree,
                                please do not use the service.
                            </p>
                        </section>

                        <section>
                            <h2>2. Eligibility</h2>
                            <p>
                                Scoutmaster is intended for individuals aged 13
                                and older. You must be at least 13 years old to
                                create an account or use the service. Users
                                under 13 are not permitted to use Scoutmaster.
                            </p>
                            <p>
                                By using Scoutmaster, you confirm that you meet
                                this age requirement. Scoutmaster does not
                                currently use a separate age verification
                                process.
                            </p>
                        </section>

                        <section>
                            <h2>3. Accounts and Account Security</h2>
                            <p>
                                You are responsible for providing a valid email
                                address and keeping your account credentials
                                secure. Do not share your login credentials or
                                allow others to use your account without
                                authorization.
                            </p>
                            <p>
                                If you believe your account has been accessed
                                without permission, contact
                                sdhs_stormbot16423@outlook.com.
                            </p>
                        </section>

                        <section>
                            <h2>4. Free Service</h2>
                            <p>
                                Scoutmaster is currently provided free of
                                charge. We may introduce new features, change
                                existing features, or consider different pricing
                                in the future. Any changes will be handled in
                                accordance with applicable law.
                            </p>
                        </section>

                        <section>
                            <h2>5. Acceptable Use</h2>
                            <p>
                                You agree to use Scoutmaster responsibly and
                                only for lawful purposes. You must not:
                            </p>
                            <ul>
                                <li>
                                    Access another team's account, data, or
                                    systems without permission.
                                </li>
                                <li>
                                    Hack, exploit vulnerabilities, or disrupt
                                    Scoutmaster or its infrastructure.
                                </li>
                                <li>Harass, threaten, or abuse other users.</li>
                                <li>
                                    Scrape, collect, copy, or redistribute
                                    service data without appropriate
                                    authorization.
                                </li>
                                <li>
                                    Use Scoutmaster for unlawful purposes or to
                                    infringe another person's rights.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2>6. Scouting Records and Team Data</h2>
                            <p>
                                Scoutmaster allows users to create and share
                                robot performance observations, scouting notes,
                                team strategies, and other scouting records.
                            </p>
                            <p>
                                Teams retain ownership of their shared scouting
                                records. Scoutmaster uses submitted records to
                                provide and synchronize the service.
                            </p>
                            <p>
                                Team members may use, export, and share their
                                team's records. You are responsible for ensuring
                                that any information you share is appropriate
                                and that you have permission when required.
                            </p>
                            <p>
                                Do not submit confidential information, personal
                                information about others, or material you are
                                not authorized to share.
                            </p>
                        </section>

                        <section>
                            <h2>7. Intellectual Property and Independence</h2>
                            <p>
                                Scoutmaster and its original software, design,
                                branding, and related materials are owned by
                                their respective rights holders. These terms do
                                not transfer ownership of Scoutmaster to users.
                            </p>
                            <p>
                                Scoutmaster is independently operated and is not
                                officially affiliated with, endorsed by, or
                                sponsored by FIRST or FIRST Tech Challenge.
                            </p>
                        </section>

                        <section>
                            <h2>8. Accuracy of Scouting Information</h2>
                            <p>
                                We do not guarantee that scouting records,
                                observations, strategies, or other information
                                entered by users are accurate, complete, or up
                                to date.
                            </p>
                            <p>
                                Users and teams are responsible for evaluating
                                the information they rely on. Scoutmaster does
                                not guarantee competition results, robot
                                performance, or the success of any strategy.
                            </p>
                        </section>

                        <section>
                            <h2>9. Service Availability and Changes</h2>
                            <p>
                                Scoutmaster is provided on an as-is and
                                as-available basis, to the extent permitted by
                                applicable law.
                            </p>
                            <p>
                                We do not guarantee uninterrupted, error-free
                                service or that scouting records will always be
                                available or recoverable. Maintenance, technical
                                issues, and third-party outages may affect
                                availability.
                            </p>
                            <p>
                                We may change, suspend, or discontinue features
                                or parts of Scoutmaster.
                            </p>
                        </section>

                        <section>
                            <h2>10. Account Suspension and Termination</h2>
                            <p>
                                You may stop using Scoutmaster and delete your
                                account through the account deletion
                                functionality provided by the service.
                            </p>
                            <p>
                                We may restrict, suspend, or terminate access
                                where reasonably necessary because of a
                                violation of these terms, a security concern,
                                unlawful activity, or the discontinuation of
                                Scoutmaster.
                            </p>
                            <p>
                                Deleting an account does not necessarily delete
                                scouting records already shared with teammates.
                                Such records may remain available to the team,
                                subject to our Privacy Policy and applicable
                                law.
                            </p>
                        </section>

                        <section>
                            <h2>11. Third-Party Services</h2>
                            <p>
                                Scoutmaster uses third-party services, including
                                Supabase for authentication and database
                                services, Render for hosting, and Resend for
                                authentication-related email delivery.
                            </p>
                            <p>
                                These services may experience outages or changes
                                outside our control. Their own terms and
                                policies may apply to the services they provide.
                            </p>
                        </section>

                        <section>
                            <h2>12. Disclaimers and Limitation of Liability</h2>
                            <p>
                                To the extent permitted by applicable law,
                                Scoutmaster is provided without guarantees that
                                it will meet every user's needs, operate without
                                errors, or preserve every record indefinitely.
                            </p>
                            <p>
                                To the extent permitted by applicable law,
                                Scoutmaster and its operator will not be liable
                                for indirect, incidental, special, or
                                consequential losses arising from the use of, or
                                inability to use, the service.
                            </p>
                            <p>
                                Nothing in these terms excludes or limits
                                rights, remedies, or liability that cannot
                                legally be excluded or limited.
                            </p>
                        </section>

                        <section>
                            <h2>13. Privacy</h2>
                            <p>
                                Your use of Scoutmaster is also subject to our
                                Privacy Policy, which explains how account
                                information and scouting records are collected,
                                used, stored, and shared.
                            </p>
                        </section>

                        <section>
                            <h2>14. Changes to These Terms</h2>
                            <p>
                                We may update these Terms of Service as
                                Scoutmaster evolves or legal requirements
                                change. Updated terms will be published with a
                                revised effective date.
                            </p>
                            <p>
                                Where required by applicable law, we will
                                provide notice of material changes or obtain any
                                necessary consent.
                            </p>
                        </section>

                        <section>
                            <h2>15. Governing Law</h2>
                            <p>
                                These terms are governed by the laws of Ontario,
                                Canada, and the applicable laws of Canada,
                                subject to mandatory laws and protections that
                                apply to you.
                            </p>
                            <p>
                                Disputes relating to Scoutmaster will be handled
                                by courts with appropriate jurisdiction, subject
                                to applicable law.
                            </p>
                        </section>

                        <section>
                            <h2>16. Contact Us</h2>
                            <p>
                                If you have questions about these Terms of
                                Service, contact the Scoutmaster operator at:
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:sdhs_stormbot16423@outlook.com">
                                    sdhs_stormbot16423@outlook.com
                                </a>
                            </p>
                            <p>
                                This is a placeholder email address. Replace it
                                with a working contact address before launch.
                            </p>
                        </section>
                    </div>

                    <footer className={"desktop-privacy-footer"}>
                        <button
                            className={"desktop-privacy-button"}
                            onClick={onClose}
                            type="button"
                        >
                            Return
                        </button>
                    </footer>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div
                    className={"phone-privacy-popup"}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tos-title"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#be0000",
                    }}
                >
                    <header
                        className={"phone-privacy-header"}
                        style={{ backgroundColor: "#be0000" }}
                    >
                        <h1
                            id="tos-title"
                            style={{
                                margin: 0,
                                color: "white",
                                fontSize: "1.8rem",
                                fontWeight: 600,
                            }}
                        >
                            Terms of Service
                        </h1>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            Effective October 25, 2026
                        </p>

                        <p style={{ marginBottom: 0, color: "#eee" }}>
                            The rules and conditions for using Scoutmaster.
                        </p>
                    </header>

                    <div className={"phone-signup-policybody"}>
                        <section>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                Welcome to Scoutmaster, an independently
                                operated scouting tool for FIRST Tech Challenge
                                (FTC) robotics teams. These Terms of Service
                                explain the rules for using Scoutmaster.
                            </p>
                            <p>
                                By creating an account or using Scoutmaster, you
                                agree to these terms. If you do not agree,
                                please do not use the service.
                            </p>
                        </section>

                        <section>
                            <h2>2. Eligibility</h2>
                            <p>
                                Scoutmaster is intended for individuals aged 13
                                and older. You must be at least 13 years old to
                                create an account or use the service. Users
                                under 13 are not permitted to use Scoutmaster.
                            </p>
                            <p>
                                By using Scoutmaster, you confirm that you meet
                                this age requirement. Scoutmaster does not
                                currently use a separate age verification
                                process.
                            </p>
                        </section>

                        <section>
                            <h2>3. Accounts and Account Security</h2>
                            <p>
                                You are responsible for providing a valid email
                                address and keeping your account credentials
                                secure. Do not share your login credentials or
                                allow others to use your account without
                                authorization.
                            </p>
                            <p>
                                If you believe your account has been accessed
                                without permission, contact
                                sdhs_stormbot16423@outlook.com.
                            </p>
                        </section>

                        <section>
                            <h2>4. Free Service</h2>
                            <p>
                                Scoutmaster is currently provided free of
                                charge. We may introduce new features, change
                                existing features, or consider different pricing
                                in the future. Any changes will be handled in
                                accordance with applicable law.
                            </p>
                        </section>

                        <section>
                            <h2>5. Acceptable Use</h2>
                            <p>
                                You agree to use Scoutmaster responsibly and
                                only for lawful purposes. You must not:
                            </p>
                            <ul>
                                <li>
                                    Access another team's account, data, or
                                    systems without permission.
                                </li>
                                <li>
                                    Hack, exploit vulnerabilities, or disrupt
                                    Scoutmaster or its infrastructure.
                                </li>
                                <li>Harass, threaten, or abuse other users.</li>
                                <li>
                                    Scrape, collect, copy, or redistribute
                                    service data without appropriate
                                    authorization.
                                </li>
                                <li>
                                    Use Scoutmaster for unlawful purposes or to
                                    infringe another person's rights.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2>6. Scouting Records and Team Data</h2>
                            <p>
                                Scoutmaster allows users to create and share
                                robot performance observations, scouting notes,
                                team strategies, and other scouting records.
                            </p>
                            <p>
                                Teams retain ownership of their shared scouting
                                records. Scoutmaster uses submitted records to
                                provide and synchronize the service.
                            </p>
                            <p>
                                Team members may use, export, and share their
                                team's records. You are responsible for ensuring
                                that any information you share is appropriate
                                and that you have permission when required.
                            </p>
                            <p>
                                Do not submit confidential information, personal
                                information about others, or material you are
                                not authorized to share.
                            </p>
                        </section>

                        <section>
                            <h2>7. Intellectual Property and Independence</h2>
                            <p>
                                Scoutmaster and its original software, design,
                                branding, and related materials are owned by
                                their respective rights holders. These terms do
                                not transfer ownership of Scoutmaster to users.
                            </p>
                            <p>
                                Scoutmaster is independently operated and is not
                                officially affiliated with, endorsed by, or
                                sponsored by FIRST or FIRST Tech Challenge.
                            </p>
                        </section>

                        <section>
                            <h2>8. Accuracy of Scouting Information</h2>
                            <p>
                                We do not guarantee that scouting records,
                                observations, strategies, or other information
                                entered by users are accurate, complete, or up
                                to date.
                            </p>
                            <p>
                                Users and teams are responsible for evaluating
                                the information they rely on. Scoutmaster does
                                not guarantee competition results, robot
                                performance, or the success of any strategy.
                            </p>
                        </section>

                        <section>
                            <h2>9. Service Availability and Changes</h2>
                            <p>
                                Scoutmaster is provided on an as-is and
                                as-available basis, to the extent permitted by
                                applicable law.
                            </p>
                            <p>
                                We do not guarantee uninterrupted, error-free
                                service or that scouting records will always be
                                available or recoverable. Maintenance, technical
                                issues, and third-party outages may affect
                                availability.
                            </p>
                            <p>
                                We may change, suspend, or discontinue features
                                or parts of Scoutmaster.
                            </p>
                        </section>

                        <section>
                            <h2>10. Account Suspension and Termination</h2>
                            <p>
                                You may stop using Scoutmaster and delete your
                                account through the account deletion
                                functionality provided by the service.
                            </p>
                            <p>
                                We may restrict, suspend, or terminate access
                                where reasonably necessary because of a
                                violation of these terms, a security concern,
                                unlawful activity, or the discontinuation of
                                Scoutmaster.
                            </p>
                            <p>
                                Deleting an account does not necessarily delete
                                scouting records already shared with teammates.
                                Such records may remain available to the team,
                                subject to our Privacy Policy and applicable
                                law.
                            </p>
                        </section>

                        <section>
                            <h2>11. Third-Party Services</h2>
                            <p>
                                Scoutmaster uses third-party services, including
                                Supabase for authentication and database
                                services, Render for hosting, and Resend for
                                authentication-related email delivery.
                            </p>
                            <p>
                                These services may experience outages or changes
                                outside our control. Their own terms and
                                policies may apply to the services they provide.
                            </p>
                        </section>

                        <section>
                            <h2>12. Disclaimers and Limitation of Liability</h2>
                            <p>
                                To the extent permitted by applicable law,
                                Scoutmaster is provided without guarantees that
                                it will meet every user's needs, operate without
                                errors, or preserve every record indefinitely.
                            </p>
                            <p>
                                To the extent permitted by applicable law,
                                Scoutmaster and its operator will not be liable
                                for indirect, incidental, special, or
                                consequential losses arising from the use of, or
                                inability to use, the service.
                            </p>
                            <p>
                                Nothing in these terms excludes or limits
                                rights, remedies, or liability that cannot
                                legally be excluded or limited.
                            </p>
                        </section>

                        <section>
                            <h2>13. Privacy</h2>
                            <p>
                                Your use of Scoutmaster is also subject to our
                                Privacy Policy, which explains how account
                                information and scouting records are collected,
                                used, stored, and shared.
                            </p>
                        </section>

                        <section>
                            <h2>14. Changes to These Terms</h2>
                            <p>
                                We may update these Terms of Service as
                                Scoutmaster evolves or legal requirements
                                change. Updated terms will be published with a
                                revised effective date.
                            </p>
                            <p>
                                Where required by applicable law, we will
                                provide notice of material changes or obtain any
                                necessary consent.
                            </p>
                        </section>

                        <section>
                            <h2>15. Governing Law</h2>
                            <p>
                                These terms are governed by the laws of Ontario,
                                Canada, and the applicable laws of Canada,
                                subject to mandatory laws and protections that
                                apply to you.
                            </p>
                            <p>
                                Disputes relating to Scoutmaster will be handled
                                by courts with appropriate jurisdiction, subject
                                to applicable law.
                            </p>
                        </section>

                        <section>
                            <h2>16. Contact Us</h2>
                            <p>
                                If you have questions about these Terms of
                                Service, contact the Scoutmaster operator at:
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:sdhs_stormbot16423@outlook.com">
                                    sdhs_stormbot16423@outlook.com
                                </a>
                            </p>
                            <p>
                                This is a placeholder email address. Replace it
                                with a working contact address before launch.
                            </p>
                        </section>
                    </div>

                    <footer className={"phone-privacy-footer"}>
                        <button
                            className={"phone-privacy-button"}
                            onClick={onClose}
                            type="button"
                        >
                            Return
                        </button>
                    </footer>
                </div>
            </>
        );
    }
}
