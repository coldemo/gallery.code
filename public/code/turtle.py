# skulpt example
# https://github.com/skulpt/skulpt/blob/master/example/turtle.html
import turtle

wn = turtle.Screen()

babbage = turtle.Turtle()
babbage.shape("triangle")

n = 8
angle = 360 / n
colors = ['red', 'blue', 'green', 'orange', 'purple']

for i in range(n):
  color = colors[i % len(colors)]
  babbage.color(color)
  # babbage.right(angle)
  babbage.left(angle)
  babbage.forward(70)
  babbage.stamp()

print "Hello World"

class Test:
  def run(self, b):
    self.a = 10 + b
    return self.a

a = Test()
print a.run(123)
