#!/bin/bash
# Create of javascript file
# declaring the citation variable
# 
# The first variable is the plain text citation file
# (one citation per line and author between braces)

#Script variable
CESURA=24
NBCITATION=0
FILE=
OUTFILE="quotesVariables.js"

while :
do
  case $1 in
    -h|--help)
      print "Usage : $(basename "$0") FILE [-h] [-o OUTFILE]\n
		Create a javascript file contening the variable usefull for the citation animation on the Home page of the site\n
		FILE is the plain text citation file with the following structure rule :\n
					\t\t\t- One citation per line\n
					\t\t\t- Citation author between braces\n
		OUTFILE is the custom name wanted for the javascript variable file (standard name is quotesVariables.js)\n\n
		
				\t\t-h,--help\t\t		display this help\n
				\t\t-o,--outfile\t\t 	write the result to OUTFILE instead of standard output file (quotesVariables.js)\n"
	  exit 0
      ;;
	-o|--outfile)
		if [ -n "$2" ]
		then
			OUTFILE=$2
			shift
		else
			printf "ERROR: "--outfile" requires a non-empty option argument.\n" >&2
			exit 1
		fi
		;;
	-outfile=?*)
		OUTFILE=${1#*=} # Delete everything up to "=" and assign the remainder.
		;;
	--outfile=)      # Handle the case of an empty --file=
		printf "ERROR: "--outfile" requires a non-empty option argument.\n" >&2
		exit 1
		;;
	--)              # End of all options.
		shift
		break
		;;
	-?*)
		printf "WARNING: Unknown option (ignored): %s\n" "$1" >&2
		;;
	*)               # Default case: If no more options then break out of the loop.
		FILE=$1
		break
		;;
    
  esac
done

#Test if the citation plain text file exist
if [ -z "$FILE" ]
then
	printf "ERROR: Plain text citation file not given. See --help for more information.\n" >&2
	exit 1
fi

#Test if the citation plain text file exist
if [ ! -f "$FILE" ]
then
	printf "ERROR: unknown plain text citation file. See --help for more information.\n" >&2
	exit 1
fi

#Write the fisrt line of the output
printf "\* Quote variable *\\
$.wedding = {};
$.wedding.quote = [\n" > $OUTFILE

NBLINE=`wc -l < $FILE`
while read LINE
do
	#Write the citation id
	printf "\t{\n\t id:%d,\n" $((NBCITATION++)) >> $OUTFILE
	#Write the first part of the citation : In the first cesura charater, take the charater before the last space
	SUB=${LINE:0:$CESURA}
	if [[ $SUB == *"("* ]]
	then
		SUB=${SUB%\(*}
	fi
	
	printf "\t partOne: \"%s\",\n" "${SUB%\ *}" >> $OUTFILE
	
	PARTONE=${SUB%\ *}
	LENGTHONE=${#PARTONE}+1
	SUB=${LINE:$LENGTHONE}
	printf "\t partTwo: \"%s\",\n" "${SUB%\{*}" >> $OUTFILE
	SUB=${LINE#*\{}
	printf "\t author: \"%s\"\n\t}" "${SUB%\}*}" >> $OUTFILE

	if [[ $NBCITATION -ne $NBLINE ]]
	then
		printf ",\n" >> $OUTFILE
	fi
done < $FILE

printf "\n];" >> $OUTFILE

exit 0