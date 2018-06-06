makedir := $(dir $(lastword $(MAKEFILE_LIST)))
topdir  := $(makedir)/..

srpm:
	dnf -y install npm jq git
	$(MAKE) -C $(topdir) srpm
	cp $(topdir)/*.src.rpm $(outdir)
