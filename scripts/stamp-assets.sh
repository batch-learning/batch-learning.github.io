#!/bin/sh
# Appends ?v=<content hash> to local assets/ CSS and JS URLs in index.html so browsers fetch changed files
# instead of serving stale cached copies. Runs as a pre-commit hook (see scripts/install-hooks.sh).
cd "$(git rev-parse --show-toplevel)" || exit 1
perl -i -pe '
  s{((?:src|href)="(assets/[^"?]+\.(?:js|css)))(?:\?v=[0-9a-f]*)?"}{
    my ($attr, $path) = ($1, $2);
    my $hash = -f $path ? substr(`shasum "$path"`, 0, 8) : "";
    $hash ? "$attr?v=$hash\"" : "$attr\"";
  }ge
' index.html
git add index.html
