require 'set'
notes_to_print = Set.new(ARGV)
notes_to_print.instance_eval do
  def include?(x)
    true
  end
end

root_dir = File.dirname( File.expand_path(__FILE__) )

puts "notes: " + notes_to_print.to_a.join(' ')

File.readlines(root_dir + '/pianokeys.txt')
    .map { |l| l.split(',') }
    .each do |_,_,note_id,freq,_|
      shortened_id = note_id[/(\S+?)(?=( |\/))/]
      note_id = shortened_id.nil? ? note_id : shortened_id
      puts %[{ name: "#{note_id}", freq: #{freq.chomp} }] if notes_to_print.include? note_id
    end
