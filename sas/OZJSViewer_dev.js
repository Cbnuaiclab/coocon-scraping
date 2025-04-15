try {
	
	// 호출순서 지켜야함
	if (!system.include('sas/Ozviewer1')) system.include('sas/Ozviewer1');
	if (!system.include('sas/Ozviewer2')) system.include('sas/Ozviewer2');
	if (!system.include('sas/Ozviewer3')) system.include('sas/Ozviewer3');
	if (!system.include('sas/Ozviewer4')) system.include('sas/Ozviewer4');

} catch (e) {
	console.log(e.stack);
}