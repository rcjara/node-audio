require 'set'
notes_to_print = Set.new(ARGV)

root_dir = File.dirname( File.expand_path(__FILE__) )

puts "notes: " + notes_to_print.to_a.join(' ')

File.readlines(root_dir + '/pianokeys.txt')
    .map { |l| l.split(',') }
    .each do |_,_,note_id,freq,_|
      note_id.split('/').each do |n|
        puts %[{ name: "#{n.chomp}", freq: #{freq.chomp} }] if notes_to_print.include? n
      end
    end
