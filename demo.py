import attr

@attr.s
class Person:
    name = attr.ib()
    age = attr.ib(default=0)

p = Person(name="Naveen")
print(p.name)  # Naveen
