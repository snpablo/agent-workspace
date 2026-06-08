import AppKit

struct Annotation {
    let label: String
    let x: CGFloat
    let y: CGFloat
    let width: CGFloat
    let height: CGFloat
    let color: NSColor
}

func rectFromTopLeft(_ x: CGFloat, _ y: CGFloat, _ width: CGFloat, _ height: CGFloat, canvasHeight: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasHeight - y - height, width: width, height: height)
}

func drawAnnotation(_ annotation: Annotation, canvasHeight: CGFloat) {
    let rect = rectFromTopLeft(annotation.x, annotation.y, annotation.width, annotation.height, canvasHeight: canvasHeight)
    let fill = annotation.color.withAlphaComponent(0.08)
    let stroke = annotation.color.withAlphaComponent(0.95)

    fill.setFill()
    NSBezierPath(roundedRect: rect, xRadius: 10, yRadius: 10).fill()

    let path = NSBezierPath(roundedRect: rect, xRadius: 10, yRadius: 10)
    path.lineWidth = 3
    stroke.setStroke()
    path.stroke()

    let labelFont = NSFont(name: "Arial Bold", size: 15) ?? NSFont.boldSystemFont(ofSize: 15)
    let labelAttributes: [NSAttributedString.Key: Any] = [
        .font: labelFont,
        .foregroundColor: NSColor.white
    ]

    let labelSize = (annotation.label as NSString).size(withAttributes: labelAttributes)
    let chipWidth = labelSize.width + 18
    let chipHeight: CGFloat = 24
    let chipRect = NSRect(x: rect.minX + 10, y: rect.maxY - chipHeight - 8, width: chipWidth, height: chipHeight)

    stroke.setFill()
    NSBezierPath(roundedRect: chipRect, xRadius: 8, yRadius: 8).fill()

    let labelPoint = NSPoint(x: chipRect.minX + 9, y: chipRect.minY + 4)
    annotation.label.draw(at: labelPoint, withAttributes: labelAttributes)
}

guard CommandLine.arguments.count == 4 else {
    fputs("usage: annotate_workspace_domain_map.swift <decision|partner> <input> <output>\n", stderr)
    exit(1)
}

let preset = CommandLine.arguments[1]
let inputPath = CommandLine.arguments[2]
let outputPath = CommandLine.arguments[3]

guard let image = NSImage(contentsOfFile: inputPath) else {
    fputs("failed to load input image\n", stderr)
    exit(1)
}

let size = image.size
let outputImage = NSImage(size: size)

let blue = NSColor(calibratedRed: 0.16, green: 0.47, blue: 0.96, alpha: 1.0)
let green = NSColor(calibratedRed: 0.18, green: 0.67, blue: 0.38, alpha: 1.0)
let purple = NSColor(calibratedRed: 0.56, green: 0.36, blue: 0.96, alpha: 1.0)
let orange = NSColor(calibratedRed: 0.94, green: 0.53, blue: 0.15, alpha: 1.0)
let red = NSColor(calibratedRed: 0.86, green: 0.25, blue: 0.25, alpha: 1.0)
let teal = NSColor(calibratedRed: 0.09, green: 0.65, blue: 0.67, alpha: 1.0)
let gray = NSColor(calibratedWhite: 0.28, alpha: 1.0)

let annotations: [Annotation]

switch preset {
case "decision":
    annotations = [
        Annotation(label: "Workspace", x: 196, y: 18, width: 1320, height: 950, color: gray),
        Annotation(label: "Thread", x: 208, y: 70, width: 270, height: 870, color: purple),
        Annotation(label: "Work Item", x: 500, y: 68, width: 740, height: 120, color: teal),
        Annotation(label: "Output", x: 500, y: 150, width: 742, height: 520, color: blue),
        Annotation(label: "Agent Activity", x: 500, y: 690, width: 545, height: 250, color: green),
        Annotation(label: "Run", x: 1055, y: 690, width: 185, height: 250, color: orange),
        Annotation(label: "Knowledge", x: 1254, y: 70, width: 270, height: 525, color: red),
        Annotation(label: "Action", x: 1254, y: 608, width: 270, height: 315, color: orange)
    ]
case "partner":
    annotations = [
        Annotation(label: "Workspace", x: 210, y: 12, width: 1314, height: 986, color: gray),
        Annotation(label: "Task Queue", x: 270, y: 65, width: 235, height: 560, color: purple),
        Annotation(label: "Agent Activity", x: 270, y: 635, width: 235, height: 380, color: green),
        Annotation(label: "Work Item", x: 515, y: 66, width: 1010, height: 140, color: teal),
        Annotation(label: "Thread", x: 520, y: 178, width: 275, height: 640, color: purple),
        Annotation(label: "Output", x: 800, y: 178, width: 690, height: 365, color: blue),
        Annotation(label: "Output", x: 800, y: 555, width: 420, height: 260, color: blue),
        Annotation(label: "Agent Activity", x: 1230, y: 555, width: 290, height: 205, color: green),
        Annotation(label: "Action", x: 1490, y: 178, width: 120, height: 365, color: orange),
        Annotation(label: "Action", x: 1230, y: 770, width: 290, height: 205, color: orange),
        Annotation(label: "Work Item Data", x: 520, y: 830, width: 970, height: 165, color: red)
    ]
default:
    fputs("unknown preset\n", stderr)
    exit(1)
}

outputImage.lockFocus()
image.draw(in: NSRect(origin: .zero, size: size))

for annotation in annotations {
    drawAnnotation(annotation, canvasHeight: size.height)
}

let note = "Illustrative UI-to-domain mapping"
let noteFont = NSFont(name: "Arial", size: 12) ?? NSFont.systemFont(ofSize: 12)
let noteAttributes: [NSAttributedString.Key: Any] = [
    .font: noteFont,
    .foregroundColor: NSColor(calibratedWhite: 0.2, alpha: 0.9)
]
let noteBackground = NSRect(x: size.width - 280, y: 16, width: 252, height: 22)
NSColor.white.withAlphaComponent(0.85).setFill()
NSBezierPath(roundedRect: noteBackground, xRadius: 8, yRadius: 8).fill()
note.draw(at: NSPoint(x: size.width - 270, y: 21), withAttributes: noteAttributes)

outputImage.unlockFocus()

guard
    let tiffData = outputImage.tiffRepresentation,
    let rep = NSBitmapImageRep(data: tiffData),
    let pngData = rep.representation(using: .png, properties: [:])
else {
    fputs("failed to encode output image\n", stderr)
    exit(1)
}

do {
    try pngData.write(to: URL(fileURLWithPath: outputPath))
} catch {
    fputs("failed to write output image: \(error)\n", stderr)
    exit(1)
}
