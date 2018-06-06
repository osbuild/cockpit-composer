makedir := $(dir $(lastword $(MAKEFILE_LIST)))
topdir  := $(makedir)/..

srpm:
	dnf -y install npm jq git
	case "$(notdir $(spec))" in \
		"cockpit-composer.spec") $(MAKE) -C $(topdir) cockpit-composer-srpm ;; \
	        *)                       $(MAKE) -C $(topdir) srpm ;; \
	esac
	cp $(topdir)/*.src.rpm $(outdir)
