#!/bin/bash

set -euxo pipefail

hugo server --disableFastRender --buildFuture --buildDrafts
