import cairo
import argparse
import random
import math
import os

from PIL import Image

# Color Palette
COLORS = [
    (145, 185, 141),
    (229, 192, 121),
    (210, 191, 88),
    (140, 190, 178),
    (255, 183, 10),
    (189, 190, 220),
    (221, 79, 91),
    (16, 182, 98),
    (227, 146, 80),
    (241, 133, 123),
    (110, 197, 233),
    (235, 205, 188),
    (197, 239, 247),
    (190, 144, 212),
    (41, 241, 195),
    (101, 198, 187),
    (255, 246, 143),
    (243, 156, 18),
    (189, 195, 199),
    (243, 241, 239)
]


def float_gen(a, b):
    return random.uniform(a, b)


def draw_background(cr, r, g, b, width, height):
    cr.set_source_rgb(r, g, b)
    cr.rectangle(0, 0, width, height)
    cr.fill()


def draw_circle_fill(cr, x, y, radius, r, g, b):
    cr.set_source_rgb(r, g, b)
    cr.arc(x, y, radius, 0, 2 * math.pi)
    cr.fill()


def draw_orbit(cr, line_width, x, y, radius):
    cr.set_line_width(line_width)

    # Bright white orbit rings
    cr.set_source_rgba(1, 1, 1, 0.6)

    cr.arc(x, y, radius, 0, 2 * math.pi)
    cr.stroke()


def draw_border(cr, size, r, g, b, width, height):
    cr.set_source_rgb(r, g, b)

    cr.rectangle(0, 0, size, height)
    cr.rectangle(width - size, 0, size, height)
    cr.rectangle(0, height - size, width, size)

    cr.fill()


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument("--width", default=3000, type=int)
    parser.add_argument("--height", default=2000, type=int)

    parser.add_argument(
        "-o",
        "--orbit",
        action="store_true",
        help="Draw orbital rings"
    )

    parser.add_argument(
        "-l",
        "--line",
        action="store_true",
        help="Draw horizontal dividers"
    )

    parser.add_argument(
        "--noise",
        default=0.4,
        type=float
    )

    parser.add_argument(
        "--bordersize",
        default=50,
        type=int
    )

    parser.add_argument(
        "--sunsize",
        default=random.randint(200, 400),
        type=int
    )

    parser.add_argument(
        "--seed",
        default=None,
        type=int,
        help="Optional random seed"
    )

    args = parser.parse_args()

    if args.seed is not None:
        random.seed(args.seed)

    width = args.width
    height = args.height

    border_size = args.bordersize

    sun_size = args.sunsize

    sun_center = height - border_size

    surface = cairo.ImageSurface(
        cairo.FORMAT_ARGB32,
        width,
        height
    )

    cr = cairo.Context(surface)

    # Dark background

    draw_background(
        cr,
        0.15,
        0.15,
        0.18,
        width,
        height
    )

    # Sun

    sun_color = random.choice(COLORS)

    sun_r = sun_color[0] / 255.0
    sun_g = sun_color[1] / 255.0
    sun_b = sun_color[2] / 255.0

    draw_circle_fill(
        cr,
        width / 2,
        sun_center,
        sun_size,
        sun_r,
        sun_g,
        sun_b
    )

    distance_between_planets = 20

    last_center = sun_center
    last_size = sun_size
    last_color = sun_color

    min_size = 5
    max_size = 70

    for x in range(1, 20):

        next_size = random.randint(
            min_size,
            max_size
        )

        next_center = (
            last_center
            - last_size
            - (next_size * 2)
            - distance_between_planets
        )

        if next_center - next_size > border_size:

            if args.orbit:

                orbit_radius = (
                    height
                    - next_center
                    - border_size
                )

                draw_orbit(
                    cr,
                    8,
                    width / 2,
                    sun_center,
                    orbit_radius
                )

            elif args.line:

                cr.set_source_rgb(0.85, 0.85, 0.85)

                cr.move_to(
                    border_size * 2,
                    next_center
                )

                cr.line_to(
                    width - border_size * 2,
                    next_center
                )

                cr.stroke()

            # Shadow ring

            draw_circle_fill(
                cr,
                width / 2,
                next_center,
                next_size * 1.3,
                0.15,
                0.15,
                0.15
            )

            rand_color = random.choice(COLORS)

            while rand_color == last_color:
                rand_color = random.choice(COLORS)

            r = rand_color[0] / 255.0
            g = rand_color[1] / 255.0
            b = rand_color[2] / 255.0

            draw_circle_fill(
                cr,
                width / 2,
                next_center,
                next_size,
                r,
                g,
                b
            )

            last_color = rand_color
            last_center = next_center
            last_size = next_size

            min_size += 5
            max_size += (5 * x)

    # Border

    draw_border(
        cr,
        border_size,
        sun_r,
        sun_g,
        sun_b,
        width,
        height
    )

    # Save files to current folder

    output_dir = os.getcwd()

    flat_path = os.path.join(
        output_dir,
        "Generative-Space-Flat.png"
    )

    texture_path = os.path.join(
        output_dir,
        "Generative-Space-Texture.png"
    )

    surface.write_to_png(flat_path)

    print("Created:", flat_path)

    # Add Texture

    pil_image = Image.open(
        flat_path
    ).convert("RGBA")

    pixels = pil_image.load()

    img_width, img_height = pil_image.size

    for i in range(img_width):
        for j in range(img_height):

            r, g, b, a = pixels[i, j]

            noise = float_gen(
                1.0 - args.noise,
                1.0 + args.noise
            )

            pixels[i, j] = (
                min(255, max(0, int(r * noise))),
                min(255, max(0, int(g * noise))),
                min(255, max(0, int(b * noise))),
                a
            )

    pil_image.save(
        texture_path,
        format="PNG"
    )

    print("Created:", texture_path)
    print("Done!")


if __name__ == "__main__":
    main()






    