export function getFiberFlags(fiber) {
    // The name of this field changed from "effectTag" to "flags"
    return ((fiber.flags !== undefined ? fiber.flags : fiber.effectTag) ?? 0);
}
