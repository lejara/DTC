import sys

file_name = str(sys.argv[1])
category_name_id = str(sys.argv[2])

print(file_name)
with open(file_name) as raw_list:
    word_list = raw_list.read().split('\n')

while (word_list.count('')): 
    word_list.remove('')  

output = '\nlist_of_categories.push(new Category("{}",'.format(category_name_id)
output += ' { '
for word_data in word_list:
    two_part = word_data.split(' : ')
    if two_part[1] != None:
        output += '"{}" : "{}", '.format(two_part[0], two_part[1]) 
    else:
        output += '"{}" : "", '.format(two_part[0]) 

output = output[:-2]
output += ' }));'

# Write to script
f = open("../TCat.js", "a")
f.write(output)
f.close()
print("---Formated---")
#print("WARNING: Becareful when running this script more than once, it will dup!")
print("OUTPUT: TCategory.js")