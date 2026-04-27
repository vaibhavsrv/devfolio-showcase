#!/bin/bash

start_date="2026-03-22"
days=12

for ((i=0; i<$days; i++))
do
  date=$(gdate -d "$start_date +$i days" +"%Y-%m-%d")

  echo "update $date" >> README.md

  GIT_AUTHOR_DATE="$date 12:00:00" \
  GIT_COMMITTER_DATE="$date 12:00:00" \
  git add .

  GIT_AUTHOR_DATE="$date 12:00:00" \
  GIT_COMMITTER_DATE="$date 12:00:00" \
  git commit -m "update project day $((i+1))"
done
