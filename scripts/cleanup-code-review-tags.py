from pathlib import Path
import re


def main() -> int:
    changed = False

    for path in Path('tests').rglob('*.spec.ts'):
        original = path.read_text(encoding='utf-8')
        updated = re.sub(r",\s*\{\s*tag:\s*['\"]@codeReview['\"]\s*\}", '', original)
        updated = re.sub(r"\{\s*tag:\s*['\"]@codeReview['\"]\s*\},\s*", '', updated)
        updated = re.sub(r"\s*@codeReview", '', updated)

        if updated != original:
            path.write_text(updated, encoding='utf-8')
            changed = True

    if changed:
        print('Removed @codeReview tags.')
    else:
        print('No @codeReview tags found.')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
