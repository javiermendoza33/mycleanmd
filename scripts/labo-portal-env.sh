#!/bin/bash
# Labo portal env setup (Nov 6 2026). Run from the Mac:  bash scripts/labo-portal-env.sh monika@example.com[,javiermendoza@gmail.com]
# 1) LABO_PROVIDER_EMAIL = who may open /provider on thelabomethod.com (comma-separated, case-insensitive).
# 2) Optional Stripe keys for the /join checkout — paste when prompted, or press Enter to skip for now.
# Then redeploys production. Claude cannot write Vercel env vars (classifier), so this is yours to run.
set -e
cd "$(dirname "$0")/.."
EMAILS="$1"; [ -z "$EMAILS" ] && { echo "usage: bash scripts/labo-portal-env.sh provider@email[,second@email]"; exit 1; }
V="vercel"; export NODE_OPTIONS="--use-system-ca"
setvar() { $V env rm "$1" production --yes >/dev/null 2>&1 || true; printf '%s' "$2" | $V env add "$1" production ${3:-} >/dev/null && echo "  $1 set"; }
setvar LABO_PROVIDER_EMAIL "$EMAILS"
read -r -s -p "Stripe SECRET key (sk_test_… or sk_live_…), Enter to skip: " SK; echo
[ -n "$SK" ] && setvar STRIPE_SECRET_KEY "$SK" --sensitive
read -r -s -p "Stripe WEBHOOK signing secret (whsec_…), Enter to skip: " WH; echo
[ -n "$WH" ] && setvar STRIPE_WEBHOOK_SECRET "$WH" --sensitive
echo "Redeploying production…"; $V --prod --yes 2>&1 | grep -E "Aliased|Error" | tail -2
echo "Done. Provider sign-in: https://thelabomethod.com/auth/login?redirect=/provider"
