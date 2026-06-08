import AppKit

guard CommandLine.arguments.count == 3 else {
    fputs("usage: genericize_workspace_mockup.swift <input> <output>\n", stderr)
    exit(1)
}

let inputPath = CommandLine.arguments[1]
let outputPath = CommandLine.arguments[2]

guard let image = NSImage(contentsOfFile: inputPath) else {
    fputs("failed to load input image\n", stderr)
    exit(1)
}

let size = image.size
let outputImage = NSImage(size: size)

outputImage.lockFocus()
image.draw(in: NSRect(origin: .zero, size: size))

let sidebarColor = NSColor(calibratedRed: 15.0 / 255.0, green: 27.0 / 255.0, blue: 49.0 / 255.0, alpha: 1.0)
sidebarColor.setFill()

let topBrandRect = NSRect(x: 0, y: size.height - 56, width: 210, height: 56)
topBrandRect.fill()

let bottomFooterRect = NSRect(x: 0, y: 0, width: 180, height: 70)
bottomFooterRect.fill()

let title = "Workspace OS"
let titleFont = NSFont(name: "Arial Bold", size: 18) ?? NSFont.boldSystemFont(ofSize: 18)
let titleAttributes: [NSAttributedString.Key: Any] = [
    .font: titleFont,
    .foregroundColor: NSColor.white
]

let titlePoint = NSPoint(x: 58, y: size.height - 34)
title.draw(at: titlePoint, withAttributes: titleAttributes)

let subtitle = "Workspace Platform"
let subtitleFont = NSFont(name: "Arial", size: 10) ?? NSFont.systemFont(ofSize: 10)
let subtitleAttributes: [NSAttributedString.Key: Any] = [
    .font: subtitleFont,
    .foregroundColor: NSColor(calibratedWhite: 0.85, alpha: 1.0)
]
subtitle.draw(at: NSPoint(x: 24, y: 18), withAttributes: subtitleAttributes)

let dotColor = NSColor.white
dotColor.setFill()
let dotSize: CGFloat = 4
let dotSpacing: CGFloat = 7
let dotOriginX: CGFloat = 24
let dotOriginY: CGFloat = size.height - 34

for row in 0..<3 {
    for col in 0..<3 {
        let dotRect = NSRect(
            x: dotOriginX + CGFloat(col) * dotSpacing,
            y: dotOriginY + CGFloat(row) * dotSpacing,
            width: dotSize,
            height: dotSize
        )
        NSBezierPath(ovalIn: dotRect).fill()
    }
}

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
