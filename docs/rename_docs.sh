#!/bin/bash

# Script to rename all documentation files with sequential numbers based on creation date

echo "🔄 Starting documentation file renaming..."
echo ""

cd /workspace/chasemycareer/docs

# Create a temporary directory for renamed files
mkdir -p .temp_rename

# Get all .md files sorted by creation date and store in array
counter=1
find . -maxdepth 1 -name "*.md" -type f -exec stat -c "%Y %n" {} \; 2>/dev/null | sort -n | while read timestamp filepath; do
    filename=$(basename "$filepath")
    
    # Skip if already numbered
    if [[ "$filename" =~ ^[0-9]{3}\. ]]; then
        echo "⏭️  Skipping already numbered: $filename"
        continue
    fi
    
    # Create new numbered filename
    new_filename=$(printf "%03d. %s" $counter "$filename")
    
    echo "📝 Renaming: $filename -> $new_filename"
    mv "$filename" ".temp_rename/$new_filename"
    
    counter=$((counter + 1))
done

# Move all renamed files back
if [ -d ".temp_rename" ]; then
    mv .temp_rename/* . 2>/dev/null
    rmdir .temp_rename
fi

echo ""
echo "✅ Renaming complete!"
echo ""
echo "📊 Summary:"
ls -1 | grep "^[0-9]" | wc -l | xargs echo "  - Total numbered files:"
echo ""
echo "📋 First 10 files:"
ls -1 | grep "^[0-9]" | head -10
