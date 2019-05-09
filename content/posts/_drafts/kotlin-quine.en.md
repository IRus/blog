---
date: 1970-01-01
draft: true
---
```ruby
#!/usr/bin/env ruby

def chomp_number
  puts "Please enter natural number"
  gets.chomp.to_i
end

def get_number
  number = chomp_number
  if number <= 0
    return get_number
  else
    return number
  end
end

def create_script(number)
  f = File.open("quine.sh", "w+")
  f.puts "#!/bin/bash"
  for i in 1..number
    i_plus_one = (i + 1).to_s
    i = i.to_s
    f.puts "ruby Quine" + i + ".rb > Quine" + i + ".java"
    f.puts "javac Quine" + i + ".java && java Quine" + i + " > Quine" + i + ".cs"
    f.puts "gmcs Quine" + i + ".cs && mono Quine" + i + ".exe > Quine" + i + ".py"
    f.puts "python Quine" + i + ".py > Quine" + i_plus_one + ".rb"
    f.puts ""
  end
  f.puts "meld Quine1.rb Quine" + (number + 1).to_s + ".rb"
  f.close
end

def generate_quine(number)
  f = File.open("Quine1.rb", "w+")
  f.puts "def e(x) return 34.chr+x+34.chr end;def q(rb,jv,cs,py,number,iteration)iteration+=1;if iteration>number then iteration=1; end;print jv+10.chr+'class Quine'+iteration.to_s+'{public static void main(String[] args){new Q().q('+e(rb)+','+e(jv)+','+e(cs)+','+e(py)+','+number.to_s+','+iteration.to_s+');}}'+10.chr end;"
  f.puts "q(\"def e(x) return 34.chr+x+34.chr end;def q(rb,jv,cs,py,number,iteration)iteration+=1;if iteration>number then iteration=1; end;print jv+10.chr+'class Quine'+iteration.to_s+'{public static void main(String[] args){new Q().q('+e(rb)+','+e(jv)+','+e(cs)+','+e(py)+','+number.to_s+','+iteration.to_s+');}}'+10.chr end;\",\"class Q{public String e(String str){return (char)34+str+(char)34;}public void q(String rb,String jv,String cs,String py,int number,int iteration){System.out.println(cs+(char)10+'c'+'l'+'a'+'s'+'s'+' '+'B'+'{'+'s'+'t'+'a'+'t'+'i'+'c'+' '+'v'+'o'+'i'+'d'+' '+'M'+'a'+'i'+'n'+'('+')'+'{'+'q'+'.'+'w'+'r'+'('+e(rb)+','+e(jv)+','+e(cs)+','+e(py)+','+Integer.toString(number)+','+Integer.toString(iteration)+')'+';'+'}'+'}');};}\",\"using System;class q{public static String e(String str){return (char)34+str+(char)34;}public static void wr(String rb,String jv,String cs,String py,int number,int iteration){Console.Write(py+(char)10+'q'+'('+e(rb)+','+e(jv)+','+e(cs)+','+e(py)+','+number.ToString()+','+iteration.ToString()+')');}}\",\"def q(rb,jv,cs,py,number,iteration):iteration = 0 if iteration==number else iteration;print rb+chr(10)+'q('+repr(rb)+','+repr(jv)+','+repr(cs)+','+repr(py)+','+str(number)+','+str(iteration)+')'\",#{number},0)"
  f.close
end

number = get_number
create_script(number)
generate_quine(number)

# exec("bash quine.sh")
```
