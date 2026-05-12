# Pomegranate Market × Third Horizon — Client Dashboard

**Contract:** CMH-26-01-POM  
**Live URL:** https://ds016683.github.io/cp-pomegranate-CMH-26-01-POM/  
**Monday Board:** https://thirdhorizonstrategies.monday.com/boards/18411269588

## Stack
React + Vite + Tailwind CSS · GitHub Pages

## Monday Integration
This dashboard is **read-only** against Monday.com board `18411269588`.  
Never write to Monday from this codebase. Data refreshes every 5 minutes client-side.

## Auth
Email allowlist + passcode. Set `VITE_CLIENT_PASSCODE` in GitHub Secrets.  
Allowlist: david@thirdhorizonstrategies.com, cheryl@thirdhorizonstrategies.com, lindsay@thirdhorizonstrategies.com, bo@thirdhorizon.com

## Deploy
Pushes to `main` trigger GitHub Actions → GitHub Pages.
