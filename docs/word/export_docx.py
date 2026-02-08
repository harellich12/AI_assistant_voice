#!/usr/bin/env python3
"""Minimal Markdown to DOCX exporter without external dependencies.

This exporter supports:
- Headings (#, ##, ###)
- Paragraphs
- Bullet-like lines (-, *)
- Numbered lines (kept as plain text)
- Fenced code blocks (rendered in monospace)
"""

from __future__ import annotations

import datetime as dt
import pathlib
import re
import zipfile
from xml.sax.saxutils import escape


def para(text: str, style: str | None = None, monospace: bool = False) -> str:
    text_xml = escape(text)
    ppr = f"<w:pPr><w:pStyle w:val=\"{style}\"/></w:pPr>" if style else ""
    rpr = ""
    if monospace:
        rpr = (
            "<w:rPr>"
            "<w:rFonts w:ascii=\"Consolas\" w:hAnsi=\"Consolas\" w:cs=\"Consolas\"/>"
            "</w:rPr>"
        )
    return f"<w:p>{ppr}<w:r>{rpr}<w:t xml:space=\"preserve\">{text_xml}</w:t></w:r></w:p>"


def markdown_to_document_xml(md_text: str, title: str) -> str:
    lines = md_text.splitlines()
    parts = []
    parts.append(para(title, style="Heading1"))
    in_code = False

    for raw in lines:
        line = raw.rstrip("\n")
        if line.strip().startswith("```"):
            in_code = not in_code
            continue

        if in_code:
            parts.append(para(line if line else " ", monospace=True))
            continue

        if not line.strip():
            parts.append("<w:p/>")
            continue

        m = re.match(r"^(#{1,3})\s+(.*)$", line)
        if m:
            level = len(m.group(1))
            style = {1: "Heading1", 2: "Heading2", 3: "Heading3"}[level]
            parts.append(para(m.group(2), style=style))
            continue

        if re.match(r"^[-*]\s+", line):
            text = re.sub(r"^[-*]\s+", "", line)
            parts.append(para(f"• {text}"))
            continue

        parts.append(para(line))

    body = "\n".join(parts)
    return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
        "<w:document "
        "xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" "
        "xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" "
        "xmlns:o=\"urn:schemas-microsoft-com:office:office\" "
        "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" "
        "xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" "
        "xmlns:v=\"urn:schemas-microsoft-com:vml\" "
        "xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" "
        "xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" "
        "xmlns:w10=\"urn:schemas-microsoft-com:office:word\" "
        "xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" "
        "xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" "
        "xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" "
        "xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" "
        "xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" "
        "xmlns:wne=\"http://schemas.microsoft.com/office/2006/wordml\" "
        "xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" "
        "mc:Ignorable=\"w14 w15 wp14\">"
        f"<w:body>{body}"
        "<w:sectPr><w:pgSz w:w=\"12240\" w:h=\"15840\"/>"
        "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\" "
        "w:header=\"708\" w:footer=\"708\" w:gutter=\"0\"/>"
        "</w:sectPr></w:body></w:document>"
    )


def styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="32"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="28"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="24"/></w:rPr>
  </w:style>
</w:styles>
"""


def content_types_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"""


def rels_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""


def document_rels_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>
"""


def app_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
            xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex Markdown Exporter</Application>
</Properties>
"""


def core_xml(title: str) -> str:
    now = dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    title_xml = escape(title)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:dcterms="http://purl.org/dc/terms/"
                   xmlns:dcmitype="http://purl.org/dc/dcmitype/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{title_xml}</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>
</cp:coreProperties>
"""


def export_docx(markdown_path: pathlib.Path, output_path: pathlib.Path, title: str) -> None:
    md = markdown_path.read_text(encoding="utf-8")
    doc_xml = markdown_to_document_xml(md, title)

    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types_xml())
        zf.writestr("_rels/.rels", rels_xml())
        zf.writestr("docProps/app.xml", app_xml())
        zf.writestr("docProps/core.xml", core_xml(title))
        zf.writestr("word/document.xml", doc_xml)
        zf.writestr("word/styles.xml", styles_xml())
        zf.writestr("word/_rels/document.xml.rels", document_rels_xml())


def main() -> None:
    base = pathlib.Path(__file__).resolve().parents[1]
    out_dir = pathlib.Path(__file__).resolve().parent

    inputs = [
        ("requirements-v1.md", "requirements-v1.docx", "Requirements v1"),
        ("architecture.md", "architecture-v1.docx", "Architecture v1"),
        ("data-model.md", "data-model-v1.docx", "Data Model v1"),
        ("api-contracts.md", "api-contracts-v1.docx", "API Contracts v1"),
        ("security-privacy.md", "security-privacy-v1.docx", "Security and Privacy v1"),
        ("roadmap-v1.md", "roadmap-v1.docx", "Roadmap v1"),
        ("backlog-v1.md", "backlog-v1.docx", "Backlog v1"),
        ("integration-strategy.md", "integration-strategy-v1.docx", "Integration Strategy v1"),
        ("cost-estimate-v1.md", "cost-estimate-v1.docx", "Cost Estimate v1"),
        ("process-log-executive.md", "process-log-executive.docx", "Process Log Executive"),
        ("process-log-detailed.md", "process-log-detailed.docx", "Process Log Detailed"),
        (
            "stage-4-build-kickoff/architecture-decision-rationale.md",
            "architecture-decision-rationale.docx",
            "Architecture Decision Rationale",
        ),
        (
            "stage-4-build-kickoff/tech-stack-decisions.md",
            "tech-stack-decisions.docx",
            "Tech Stack Decisions",
        ),
        (
            "stage-4-build-kickoff/tech-stack-rationale.md",
            "tech-stack-rationale.docx",
            "Tech Stack Rationale",
        ),
    ]

    for src, dest, title in inputs:
        export_docx(base / src, out_dir / dest, title)
        print(f"Generated {out_dir / dest}")


if __name__ == "__main__":
    main()
