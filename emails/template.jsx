import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/** -----------------------------
 * ✅ Dummy Data for Preview Mode
 * ----------------------------- */
export const PREVIEW_DATA = {
  monthlyReport: {
    userName: "",
    type: "monthly-report",
    data: {
      
    },
  },
  budgetAlert: {
    userName: "",
    type: "budget-alert",
    data: {
      
    },
  },
};

/** -----------------------------
 * ✅ Email Template Component
 * ----------------------------- */
export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  const stats = data?.stats || {
    totalIncome: 0,
    totalExpenses: 0,
    byCategory: {},
  };
  const insights = data?.insights || [];
  const month = data?.month || "this month";

  /** ========== MONTHLY REPORT ========== */
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName || "User"},</Text>
            <Text style={styles.text}>
              Here’s your financial summary for {month}:
            </Text>

            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>${stats.totalIncome}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>${stats.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  ${stats.totalIncome - stats.totalExpenses}
                </Text>
              </div>
            </Section>

            {Object.keys(stats.byCategory).length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(stats.byCategory).map(([category, amount]) => (
                  <div key={category} style={styles.row}>
                    <Text style={styles.text}>{category}</Text>
                    <Text style={styles.text}>${amount}</Text>
                  </div>
                ))}
              </Section>
            )}

            {insights.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Welth Insights</Heading>
                {insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using <strong>Welth</strong>. Keep tracking your
              finances for better financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  /** ========== BUDGET ALERT ========== */
  if (type === "budget-alert") {
    const budgetAmount = data?.budgetAmount || 0;
    const totalExpenses = data?.totalExpenses || 0;
    const percentageUsed =
      data?.percentageUsed ??
      (budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0);

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName || "User"},</Text>
            <Text style={styles.text}>
              You’ve used {percentageUsed.toFixed(1)}% of your monthly budget.
            </Text>

            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>${budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>${totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  ${budgetAmount - totalExpenses}
                </Text>
              </div>
            </Section>

            <Text style={styles.footer}>
              Stay mindful of your spending to stay within your goals.
              <br />
              Keep up the good work with <strong>Welth</strong>!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

/** -----------------------------
 * ✅ Shared Styles
 * ----------------------------- */
const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
  },
  title: {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 12px",
  },
  text: {
    color: "#4b5563",
    fontSize: "15px",
    margin: "0 0 12px",
    lineHeight: "1.5",
  },
  section: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "24px 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};

/** -----------------------------
 * ✅ Choose which dummy data to preview
 * ----------------------------- */
// Toggle this line to test either email in React Email dev preview:


// Or test the other one:
// EmailTemplate.PreviewProps = PREVIEW_DATA.budgetAlert;
