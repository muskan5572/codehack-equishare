import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        footer_text = f"EquiShare — CodeHack Hackathon 48-Hour Submission  |  Page {self._pageNumber} of {page_count}"
        self.drawString(54, 30, footer_text)
        self.drawRightString(letter[0] - 54, 30, "Live: https://codehack-equishare.vercel.app/")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 42, letter[0] - 54, 42)
        self.restoreState()

def build_pdf(filename="EquiShare_Project_Submission.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=45,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a')
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#d97706')
    )
    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#475569')
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=12,
        spaceAfter=6
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#b45309'),
        spaceBefore=8,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )
    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )
    code_box = ParagraphStyle(
        'CodeBox',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#0369a1'),
        backColor=colors.HexColor('#f0f9ff'),
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=8
    )

    story = []

    # ================= PAGE 1 =================
    header_data = [
        [
            Paragraph("<b>EquiShare</b>", title_style),
            Paragraph("<b>CodeHack Hackathon (48-Hr Round)</b><br/>Track: <i>Unlock Underused Equipment & Spaces</i><br/>Lead: <b>Muskan Gupta</b>", meta_style)
        ],
        [
            Paragraph("Institutional Equipment & Space Sharing Governance Platform", subtitle_style),
            Paragraph("Repo: <u>github.com/muskan5572/codehack-equishare</u><br/>Live: <u>codehack-equishare.vercel.app</u>", meta_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[330, 180])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#f59e0b'), spaceBefore=8, spaceAfter=10))

    # Executive Summary & Problem
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(Paragraph(
        "Universities, research laboratories, makerspaces, and community fabrication hubs own millions of dollars in advanced capital assets—such as <b>5-axis CNC milling centers, scanning electron microscopes (SEM), 120W precision laser cutters, and 8K cinema camera rigs</b>—that remain idle <b>60% to 75% of the time</b>.",
        body_style
    ))
    story.append(Paragraph(
        "At the same time, student researchers, interdisciplinary creators, and early-stage startup teams cannot access these tools because commercial rentals or capital purchasing are prohibitively expensive. Standard booking calendars fail completely in institutional environments because they ignore 4 core requirements: <b>(1) Safety & Operator Qualification Liability</b>, <b>(2) Before/After Condition Baseline Audits</b>, <b>(3) Anti-Monopolization Quotas</b>, and <b>(4) Human-in-the-Loop Governance</b>.",
        body_style
    ))

    # 10-Step Lifecycle Table
    story.append(Paragraph("2. The EquiShare 10-Step Governance Lifecycle", h1_style))
    story.append(Paragraph("EquiShare closes this governance gap by transforming ordinary calendar booking into an automated institutional trust loop:", body_style))

    steps_data = [
        [Paragraph("Step", table_header), Paragraph("Stage", table_header), Paragraph("Institutional Governance Function", table_header)],
        [Paragraph("01", table_header), Paragraph("Resource Listing", table_cell), Paragraph("Owners define capacity, location, safety credentials, max duration limits, and refundable deposits.", table_cell)],
        [Paragraph("02", table_header), Paragraph("Eligibility Check", table_cell), Paragraph("Automated verification of safety certificates against institutional database before booking.", table_cell)],
        [Paragraph("03", table_header), Paragraph("Access Request", table_cell), Paragraph("Applicant selects timeslot, states academic research purpose, and nominates supervising faculty.", table_cell)],
        [Paragraph("04", table_header), Paragraph("Fair-Use Validation", table_cell), Paragraph("System validates active reservation limits (max 2) and calculates FairShare reputation quota impact.", table_cell)],
        [Paragraph("05", table_header), Paragraph("Manager Review", table_cell), Paragraph("Human-in-the-loop review desk for facility directors with mandatory explainable rationale input.", table_cell)],
        [Paragraph("06", table_header), Paragraph("Fair Allocation", table_cell), Paragraph("Approved, rejected with documented rationale, or placed on priority queue (auto-promotes on cancel).", table_cell)],
        [Paragraph("07", table_header), Paragraph("Check-In Baseline", table_cell), Paragraph("Pre-flight safety inspection: emergency stop test, calibration verify, 1-5 star cleanliness & photo.", table_cell)],
        [Paragraph("08", table_header), Paragraph("Return Inspection", table_cell), Paragraph("Side-by-side Before vs. After condition comparison card with automatic degradation detection.", table_cell)],
        [Paragraph("09", table_header), Paragraph("Incident Governance", table_cell), Paragraph("Damage or delay tickets automatically trigger investigation flags, deposit holds, and score adjustments.", table_cell)],
        [Paragraph("10", table_header), Paragraph("Audit Trail Ledger", table_cell), Paragraph("Tamper-evident, cryptographically timestamped compliance history with expandable raw JSON metadata.", table_cell)],
    ]
    steps_table = Table(steps_data, colWidths=[35, 110, 365])
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(steps_table)

    story.append(Paragraph("3. FairShare™ Anti-Monopolization Algorithm", h1_style))
    story.append(Paragraph(
        "To prevent well-funded senior labs from monopolizing peak machine hours, EquiShare implements an explainable mathematical quota engine (<code>fairUse.ts</code>):",
        body_style
    ))
    story.append(Paragraph(
        "<b>FairShare Score = Base (100) - Active Hold - Tool Weight + Cross-Dept Bonus (+10) + Return Reward (+2)</b>",
        code_box
    ))
    story.append(Paragraph(
        "• <b>Mandatory Cooldowns (12h–48h):</b> Restricts repeated consecutive bookings of the same heavy tool to give others a turn.<br/>"
        "• <b>Cross-Silo Incentive (+10 Pts):</b> Rewards interdisciplinary collaboration (e.g. Bio students utilizing Robotics equipment).<br/>"
        "• <b>Concurrent Cap (Max 2):</b> Restricts a single team from reserving more than 2 active high-value assets simultaneously.",
        body_style
    ))

    # ================= PAGE 2 =================
    story.append(PageBreak())

    story.append(Paragraph("4. 1-Click Judge Sandbox & Demonstration Personas", h1_style))
    story.append(Paragraph(
        "To enable judges to evaluate the multi-party institutional trust workflow without tedious credential logins, EquiShare includes a persistent <b>1-Click Role Switcher</b> at the top of every screen:",
        body_style
    ))

    personas_data = [
        [Paragraph("Persona", table_header), Paragraph("Role", table_header), Paragraph("Department", table_header), Paragraph("Evaluation Function & Test Scenario", table_header)],
        [
            Paragraph("<b>Muskan Gupta</b>", table_cell),
            Paragraph("Lab Director & Approver", table_cell),
            Paragraph("Robotics & Fabrication Institute", table_cell),
            Paragraph("Evaluates applicant FairShare scores, inspects submitted qualifications, types explainable decision notes, approves bookings (with confetti feedback), and handles damage disputes.", table_cell)
        ],
        [
            Paragraph("<b>Ishan Roshan</b>", table_cell),
            Paragraph("Senior Researcher", table_cell),
            Paragraph("Materials Science & Bioengineering", table_cell),
            Paragraph("Holds verified <i>Laser Safety Level 2</i> & <i>Cleanroom Level 100</i> certificates. Demonstrates immediate booking eligibility, performs pre-use check-in baseline, and completes return inspection (+2 score reward).", table_cell)
        ],
        [
            Paragraph("<b>Shray Shayus</b>", table_cell),
            Paragraph("Student / Creator", table_cell),
            Paragraph("Mechanical Engineering", table_cell),
            Paragraph("Unverified operator without required certifications. Demonstrates eligibility blocking ('Missing Certification'), submitting safety training proofs, and transparent waitlist queuing.", table_cell)
        ],
    ]
    personas_table = Table(personas_data, colWidths=[90, 95, 115, 210])
    personas_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(personas_table)

    story.append(Paragraph("5. Recommended 3-Minute Judge Evaluation Walkthrough", h1_style))
    walkthrough_steps = [
        "<b>1. Explore as Ishan Roshan:</b> Select Ishan. Notice the green <i>'Verified & Ready'</i> pill on the Scanning Electron Microscope. Click <i>'Request Access'</i>, enter a research purpose, and submit.",
        "<b>2. Switch to Muskan Gupta (Approver):</b> Click Muskan. Go to the <i>'Approvals'</i> tab. Review Ishan's 94/100 FairShare score and qualifications. Type an explainable rationale and click <i>'Approve Reservation'</i>.",
        "<b>3. Switch to Ishan Roshan:</b> Open <i>'Reservations'</i>. Click <i>'Step 7: Check-In Baseline'</i>. Complete the safety checklist (emergency stop, calibration), set cleanliness to 5★, and confirm to unlock.",
        "<b>4. Complete Return Handover:</b> Click <i>'Step 8: Return Inspection'</i>. View the side-by-side Before vs. After condition comparison card. Sign off on return to trigger deposit release and earn +2 reputation.",
        "<b>5. Verify Audit Trail:</b> Open the <i>'Audit Trail'</i> tab to view the tamper-evident, cryptographically timestamped ledger recording every actor, decision rationale, and state change."
    ]
    for step in walkthrough_steps:
        story.append(Paragraph(f"• {step}", body_style))

    story.append(Paragraph("6. Architecture, Tech Stack & Hackathon Disclosures", h1_style))
    story.append(Paragraph(
        "• <b>Frontend Architecture:</b> Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.<br/>"
        "• <b>Design System:</b> Deep Industrial Amber & Haas Gold aesthetic inspired by aerospace and advanced robotics foundry workshops.<br/>"
        "• <b>Backend & Data Layer:</b> Supabase (PostgreSQL with Row-Level Security), hybrid store with instant hydration and cloud sync.<br/>"
        "• <b>Safety & AI Compliance (Rule 12):</b> Important access and penalty decisions require human-in-the-loop explainability rather than unexplained automated systems. Licensed under the MIT Open Source License.<br/>"
        "• <b>Continuous Development History:</b> Built authentic codebase with 23 commits pushed to GitHub during the official 48-hour build window.",
        body_style
    ))

    # Official Submission Links Box
    links_data = [
        [Paragraph("<b>Official Public Links (Verified 24/7 Accessible):</b><br/>"
                   "• <b>Live Deployed Platform:</b> <font color='#b45309'><b><u>https://codehack-equishare.vercel.app/</u></b></font><br/>"
                   "• <b>Public GitHub Repository:</b> <font color='#b45309'><b><u>https://github.com/muskan5572/codehack-equishare</u></b></font>",
                   body_style)]
    ]
    links_table = Table(links_data, colWidths=[510])
    links_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffbeb')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#f59e0b')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(Spacer(1, 4))
    story.append(links_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename} ({os.path.getsize(filename)} bytes)")

if __name__ == "__main__":
    build_pdf()
