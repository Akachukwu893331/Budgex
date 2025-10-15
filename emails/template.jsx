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
 * ✅ Helper Function
 * ----------------------------- */
function formatAmount(num = 0) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** -----------------------------
 * ✅ Redesigned Email Template
 * ----------------------------- */
export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  /** ========== MONTHLY REPORT ========== */
  if (type === "monthly-report") {
    const stats = data.stats || {};
    const month = data.month || "this month";
    const insights = data.insights || [];
    const net = stats.totalIncome - stats.totalExpenses;

    return (
      <Html>
        <Head />
        <Preview>{`Your ${month} Financial Summary`}</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            {/* HEADER */}
            <Section style={styles.headerSection}>
              <Heading style={styles.headerTitle}>📊 Monthly Report</Heading>
              <Text style={styles.headerMonth}>{month}</Text>
            </Section>

            {/* GREETING */}
            <Section style={styles.content}>
              <Text style={styles.greeting}>Hi {userName || "there"},</Text>
              <Text style={styles.subtitle}>
                Here's your financial overview for this month:
              </Text>

              {/* SUMMARY CARDS */}
              <div style={styles.summaryRow}>
                <div style={{ ...styles.card, ...styles.income }}>
                  <Text style={styles.cardTitle}>Total Income</Text>
                  <Text style={styles.cardValue}>
                    ${formatAmount(stats.totalIncome)}
                  </Text>
                  <Text style={styles.cardNote}>💰 Stable Growth</Text>
                </div>

                <div style={{ ...styles.card, ...styles.expense }}>
                  <Text style={styles.cardTitle}>Total Expenses</Text>
                  <Text style={styles.cardValue}>
                    ${formatAmount(stats.totalExpenses)}
                  </Text>
                  <Text style={styles.cardNote}>📉 Controlled Spending</Text>
                </div>

                <div
                  style={{
                    ...styles.card,
                    ...(net >= 0 ? styles.surplus : styles.deficit),
                  }}
                >
                  <Text style={styles.cardTitle}>Net Balance</Text>
                  <Text
                    style={{
                      ...styles.cardValue,
                      color: net >= 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    ${formatAmount(net)}
                  </Text>
                  <Text style={styles.cardNote}>
                    {net >= 0 ? "✅ Surplus" : "⚠️ Over budget"}
                  </Text>
                </div>
              </div>

              {/* SPENDING BREAKDOWN */}
              {Object.keys(stats.byCategory || {}).length > 0 && (
                <Section style={styles.breakdownSection}>
                  <Text style={styles.sectionHeading}>Spending Breakdown</Text>
                  {Object.entries(stats.byCategory).map(([cat, amount]) => (
                    <div key={cat} style={styles.categoryItem}>
                      <div style={styles.categoryHeader}>
                        <Text style={styles.categoryName}>{cat}</Text>
                        <Text style={styles.categoryAmount}>
                          ${formatAmount(amount)}
                        </Text>
                      </div>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${
                              (amount / stats.totalExpenses) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Section>
              )}

              {/* INSIGHTS */}
              {insights.length > 0 && (
                <Section>
                  <Text style={styles.sectionHeading}>Smart Insights</Text>
                  {insights.map((tip, i) => (
                    <div key={i} style={styles.tipBox}>
                      <Text style={styles.tipIcon}>💡</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </div>
                  ))}
                </Section>
              )}

              {/* FOOTER */}
              <Section style={styles.footer}>
                <Text style={styles.footerText}>
                  Stay in control with <strong>Budgex</strong>.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  /** ========== BUDGET ALERT ========== */
  if (type === "budget-alert") {
    const { budgetAmount = 0, totalExpenses = 0, percentageUsed = 0 } = data;
    const remaining = budgetAmount - totalExpenses;
    const over = remaining < 0;

    return (
      <Html>
        <Head />
        <Preview>⚠️ Budget Alert: {percentageUsed}% Used</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            {/* HEADER */}
            <Section style={styles.alertHeader}>
              <Heading style={styles.headerTitle}>⚠️ Budget Alert</Heading>
              <Text style={styles.alertSubtitle}>
                {percentageUsed}% of your budget is already used!
              </Text>
            </Section>

            {/* SUMMARY */}
            <Section style={styles.content}>
              <div style={styles.alertRow}>
                <div style={{ ...styles.card, ...styles.expense }}>
                  <Text style={styles.cardTitle}>Total Budget</Text>
                  <Text style={styles.cardValue}>
                    ${formatAmount(budgetAmount)}
                  </Text>
                </div>
                <div style={{ ...styles.card, ...styles.income }}>
                  <Text style={styles.cardTitle}>Spent</Text>
                  <Text style={styles.cardValue}>
                    ${formatAmount(totalExpenses)}
                  </Text>
                </div>
                <div
                  style={{
                    ...styles.card,
                    ...(over ? styles.deficit : styles.surplus),
                  }}
                >
                  <Text style={styles.cardTitle}>
                    {over ? "Over Budget" : "Remaining"}
                  </Text>
                  <Text
                    style={{
                      ...styles.cardValue,
                      color: over ? "#ef4444" : "#10b981",
                    }}
                  >
                    ${formatAmount(Math.abs(remaining))}
                  </Text>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <Section style={{ marginTop: "20px" }}>
                <Text style={styles.sectionHeading}>Budget Usage</Text>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${percentageUsed}%`,
                      backgroundColor: over ? "#ef4444" : "#3b82f6",
                    }}
                  />
                </div>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: "12px",
                    color: over ? "#ef4444" : "#6b7280",
                    marginTop: "4px",
                  }}
                >
                  {percentageUsed}% used
                </Text>
              </Section>

              {/* FOOTER */}
              <Section style={styles.footer}>
                <Text style={styles.footerText}>
                  Keep your budget on track with <strong>Budgex</strong>.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

/** -----------------------------
 * ✅ Styles (modern minimal look)
 * ----------------------------- */
const styles = {
  body: {
    backgroundColor: "#f3f4f6",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "40px 0",
  },
  container: {
    maxWidth: "640px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  headerSection: {
    background: "linear-gradient(120deg, #4f46e5, #7c3aed)",
    color: "white",
    textAlign: "center",
    padding: "40px 20px",
  },
  headerTitle: { fontSize: "26px", marginBottom: "6px" },
  headerMonth: { fontSize: "15px", opacity: 0.9 },
  content: { padding: "30px" },
  greeting: { fontSize: "18px", fontWeight: 600, color: "#111827" },
  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "25px",
  },
  summaryRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  alertRow: { display: "flex", gap: "15px", flexWrap: "wrap" },
  card: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid #e5e7eb",
  },
  income: { borderTop: "4px solid #10b981" },
  expense: { borderTop: "4px solid #ef4444" },
  surplus: { borderTop: "4px solid #10b981" },
  deficit: { borderTop: "4px solid #ef4444" },
  cardTitle: { fontSize: "13px", color: "#6b7280", textTransform: "uppercase" },
  cardValue: { fontSize: "22px", fontWeight: 700, color: "#111827" },
  cardNote: { fontSize: "12px", color: "#6b7280", marginTop: "4px" },
  breakdownSection: { marginBottom: "24px" },
  sectionHeading: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "10px",
  },
  categoryItem: { marginBottom: "10px" },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  categoryName: { fontSize: "14px", color: "#374151" },
  categoryAmount: { fontSize: "14px", fontWeight: 600, color: "#111827" },
  progressBar: {
    backgroundColor: "#e5e7eb",
    height: "6px",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "6px",
    backgroundColor: "#3b82f6",
    borderRadius: "3px",
  },
  tipBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    gap: "10px",
    marginBottom: "8px",
  },
  tipIcon: { fontSize: "16px" },
  tipText: { fontSize: "14px", color: "#374151" },
  alertHeader: {
    backgroundColor: "#fef2f2",
    textAlign: "center",
    padding: "40px 20px",
    borderBottom: "1px solid #fee2e2",
  },
  alertSubtitle: {
    fontSize: "14px",
    color: "#b91c1c",
    marginTop: "6px",
  },
  footer: {
    marginTop: "30px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "16px",
  },
  footerText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
  },
};

/** Default Preview */
//EmailTemplate.PreviewProps = PREVIEW_DATA.monthlyReport;
