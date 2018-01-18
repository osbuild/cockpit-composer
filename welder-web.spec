%if "%{!?releasever:1}"
%define releasever 0
%endif

Name: welder-web
Version: %{releasever}
Release: 1%{?dist}
Summary: Welder UI
License: MIT

Source: welder-web-%{version}.tar.gz
BuildArch: noarch

%define debug_package %{nil}

%description
Welder UI

%prep

%build

%install
mkdir -p %{buildroot}
tar --strip-components=1 -xzf %{sources} -C %{buildroot}
find %{buildroot} -type f >> files.list
sed -i "s|%{buildroot}||" *.list

%files -f files.list

%changelog
