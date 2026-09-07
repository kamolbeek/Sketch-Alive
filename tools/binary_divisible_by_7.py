"""Binar (ikkilik) satr 7 ga bo'linadimi? Faqat regex bilan tekshirish.

Mod-7 DFA (holatlar 0..6, o'tish: s -> (2*s + bit) % 7) dan
"state elimination" usuli bilan qurilgan regex.

Qoidalar:
  * bo'sh satr rad etiladi
  * '0' va '1' dan boshqa belgi bo'lsa rad etiladi
  * "0" qabul qilinadi (0 soni 7 ga bo'linadi)
"""

import re

DIVISIBLE_BY_7 = (
    r"^(0|(11|1010|(10(0|11))((1|00)(0|11))*(01|(1|00)10))"
    r"(01*(00|01((1|00)(0|11))*(01|(1|00)10)))*1)+$"
)


def solution():
    """7 ga bo'linadigan binar satrlarga mos keladigan regex."""
    return DIVISIBLE_BY_7


_PATTERN = re.compile(DIVISIBLE_BY_7)


def is_divisible_by_7(binary_string):
    """Satr 7 ga bo'linadigan binar sonni bildirsa True qaytaradi."""
    return _PATTERN.fullmatch(binary_string) is not None


if __name__ == "__main__":
    # O'z-o'zini tekshirish: regex natijasi haqiqiy bo'linish bilan solishtiriladi.
    for n in range(100000):
        s = bin(n)[2:]
        assert is_divisible_by_7(s) == (n % 7 == 0), (n, s)

    assert is_divisible_by_7("0")
    assert is_divisible_by_7("111")        # 7
    assert is_divisible_by_7("1110")       # 14
    assert is_divisible_by_7("10101")      # 21
    assert not is_divisible_by_7("")
    assert not is_divisible_by_7("1")
    assert not is_divisible_by_7("110")    # 6
    assert not is_divisible_by_7("102")
    assert not is_divisible_by_7("abc")
    print("Barcha testlar o'tdi. Regex:")
    print(solution())
